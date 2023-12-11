const PREPEND = 'CALL apoc.periodic.iterate(';
const POSTPEND = ')';
const COMMA = ',';

function generateCypher(
  cypherIterate: string,
  cypherAction: string,
  paramsStr = '{ batch: $batch }',
): string {
  return [
    PREPEND,
    `"${cypherIterate}"`,
    COMMA,
    `"${cypherAction}"`,
    COMMA,
    `{ batchSize: 10000, parallel: true, params: ${paramsStr} }`,
    POSTPEND,
  ].join(' ');
}

const BULK_CREATE_BADGE_TYPE = [
  'UNWIND $badgeTypes AS badgeType',
  'MERGE (bt:DiscourseBadgeType { id: badgeType.id, forumUuid: badgeType.forumUuid })',
  'ON CREATE SET',
  'bt.id = badgeType.id,',
  'bt.name = badgeType.name',
  'ON MATCH SET',
  'bt.name = badgeType.name',
].join(' ');

const BULK_CREATE_BADGE_GROUPING = generateCypher(
  'UNWIND $batch AS badgeGrouping return badgeGrouping',
  'MERGE (b:DiscourseBadgeGrouping { id: badgeGrouping.id, forumUuid: badgeGrouping.forumUuid }) SET b += badgeGrouping',
);

const BULK_CREATE_BADGE = [
  'UNWIND $badges AS badge',
  'MERGE (b:DiscourseBadge { id: badge.id, forumUuid: badge.forumUuid })',
  'ON CREATE SET',
  'b.id = badge.id,',
  'b.name = badge.name,',
  'b.description = badge.description,',
  'b.longDescription = badge.long_description,',
  'b.icon = badge.icon,',
  'b.imageUrl = badge.image_url,',
  'b.forumUuid = badge.forumUuid',
  'ON MATCH SET',
  'b.name = badge.name,',
  'b.description = badge.description,',
  'b.longDescription = badge.long_description,',
  'b.icon = badge.icon,',
  'b.imageUrl = badge.image_url,',
  'b.forumUuid = badge.forumUuid',
  'WITH b, badge',
  'MERGE (bt:DiscourseBadgeType { id: badge.badgeTypeId, forumUuid: badge.forumUuid })',
  'MERGE (b)-[:HAS_TYPE]->(bt)',
  'MERGE (bg:DiscourseBadgeGrouping { id: badge.badgeGroupingId, forumUuid: badge.forumUuid })',
  'MERGE (b)-[:HAS_GROUPING]->(bg)',
].join(' ');

const BULK_CREATE_TAG_GROUP = generateCypher(
  'UNWIND $batch AS tagGroup RETURN tagGroup',
  [
    'MERGE (tg:DiscourseTagGroup { id: tagGroup.id, forumUuid: tagGroup.forumUuid })',
    'SET tg.name = tagGroup.name',
    'WITH tg, tagGroup.tags AS tags',
    'UNWIND tags as tag',
    'MERGE (t:DiscourseTag { id: tag.id, forumUuid: tg.forumUuid }) SET t += tag',
    'SET t.forumUuid = tg.forumUuid',
    'MERGE (tg)-[:CONTAINS]->(t)',
  ].join(' '),
);

const BULK_CREATE_TAG = generateCypher(
  'UNWIND $batch AS tag RETURN tag',
  'MERGE (t:DiscourseTag { id: tag.id, forumUuid: tag.forumUuid}) SET t += tag',
);

const BULK_CREATE_GROUP = generateCypher(
  'UNWIND $batch AS group RETURN group',
  'MERGE (g:DiscourseGroup { id: group.id, forumUuid: group.forumUuid }) SET g += group',
);

const BULK_CREATE_GROUP_MEMBERS = generateCypher(
  'UNWIND $batch AS member RETURN member',
  [
    'MERGE(u:DiscourseUser { id: member.id, forumUuid: member.forumUuid })',
    'MERGE(g:DiscourseGroup { id: $groupId, forumUuid: member.forumUuid })',
    'MERGE (g)-[:HAS_MEMBER]->(u)',
  ].join(' '),
  '{ batch: $batch, groupId: $groupId }',
);

const BULK_CREATE_GROUP_OWNERS = generateCypher(
  'UNWIND $batch AS owner RETURN owner',
  [
    'MERGE(u:DiscourseUser { id: owner.id, forumUuid: owner.forumUuid })',
    'MERGE(g:DiscourseGroup { id: $groupId, forumUuid: owner.forumUuid })',
    'MERGE (g)-[:HAS_OWNER]->(u)',
  ].join(' '),
  '{ batch: $batch, groupId: $groupId }',
);

const BULK_CREATE_CATEGORY = generateCypher(
  'UNWIND $batch AS category RETURN category',
  [
    'MERGE (c:DiscourseCategory { id: category.id, forumUuid: category.forumUuid })',
    'ON CREATE SET',
    'c.id = category.id,',
    'c.forumUuid = category.forumUuid,',
    'c.name = category.name,',
    'c.color = category.color,',
    'c.description = category.description,',
    'c.descriptionText = category.descriptionText',
    'ON MATCH SET',
    'c.name = category.name,',
    'c.color = category.color,',
    'c.description = category.description,',
    'c.descriptionText = category.descriptionText',
    'WITH c, category',
    'WHERE category.parentCategoryId IS NOT NULL',
    'MERGE (p:DiscourseCategory { id: category.parentCategoryId, forumUuid: category.forumUuid })',
    'MERGE (c)-[:HAS_PARENT]->(p)',
  ].join(' '),
);

const BULK_CREATE_TOPIC = generateCypher(
  'UNWIND $batch AS topic RETURN topic',
  [
    'MERGE (t:DiscourseTopic { id: topic.id, forumUuid: topic.forumUuid }) SET t += topic',
    'MERGE (c:DiscourseCategory { id: t.categoryId, forumUuid: t.forumUuid })',
    'MERGE (c)-[:HAS_TOPIC]->(t)',
  ].join(' '),
);

const BULK_CREATE_POST = generateCypher(
  'UNWIND $batch AS post RETURN post',
  [
    'MERGE (t:DiscourseTopic { id: post.topicId, forumUuid: post.forumUuid })',
    'MERGE (u:DiscourseUser { id: post.userId, forumUuid: post.forumUuid })',
    'MERGE (p:DiscoursePost { id: post.id, forumUuid: post.forumUuid }) SET p += post',
    'MERGE (u)-[r:POSTED]->(p)',
    'MERGE (t)-[:HAS_POST]->(p)',
    'ON CREATE SET r.createdAt = p.createdAt',
    'WITH p, post',
    'WHERE post.replyToPostNumber IS NOT NULL',
    'MERGE (rT:DiscoursePost { postNumber: post.replyToPostNumber, topicId: post.topicId, forumUuid: post.forumUuid })',
    'MERGE (p)-[:REPLIED]->(rT)',
  ].join(' '),
);

// const BULK_CREATE_USER = generateCypher(
//   'UNWIND $batch AS user RETURN user',
//   [
//     'MATCH (f:DiscourseForum { uuid: user.forumUuid })', // This is a MATCH because we don't want to recreate a forum
//     'MERGE (u:DiscourseUser { id: user.id, forumUuid: user.forumUuid }) SET u += user',
//     'MERGE (u)-[:HAS_JOINED]->(f)',
//   ].join(' '),
// );

const BULK_CREATE_ACTION = generateCypher(
  'UNWIND $batch AS action RETURN action',
  [
    // LIKE = 1
    'WHERE action.actionType = 1',
    'MERGE (u:DiscourseUser { id: action.actingUserId, forumUuid: action.forumUuid })',
    'MERGE (p:DiscoursePost { id: action.postId, forumUuid: action.forumUuid })',
    'MERGE (u)-[l:LIKED]->(p)',
    'SET',
    'l.createdAt = action.createdAt,',
    'l.deleted = action.deleted',
    // WAS_LIKE = 2
    // NEW_TOPIC = 4
    // REPLY = 5
    // RESPONSE = 6
    // MENTION = 7
    // QUOTE = 9
    // EDIT = 11
    // NEW_PRIVATE_MESSAGE = 12
    // GOT_PRIVATE_MESSAGE = 13
    // SOLVED = 15
    // ASSIGNED = 16
  ].join(' '),
);

const BULK_CREATE_USER_BADGE = generateCypher(
  'UNWIND $batch AS userBadge RETURN userBadge',
  [
    'MERGE(b:DiscourseBadge { id: userBadge.badgeId, forumUuid: userBadge.forumUuid })',
    'MERGE(u:DiscourseUser { id: userBadge.userId, forumUuid: userBadge.forumUuid })',
    'MERGE (u)-[r:HAS_BADGE]->(b)',
    "SET r += apoc.map.removeKeys(userBadge, ['badgeId', 'userId'])",
  ].join(' '),
);

const BULK_CREATE_TOPIC_TAG = generateCypher(
  'UNWIND $batch AS topicTag RETURN topicTag',
  [
    'MERGE (tag:DiscourseTag { id: topicTag.tagId, forumUuid: topicTag.forumUuid })',
    'MERGE (t:DiscourseTopic { id: topicTag.topicId, forumUuid: topicTag.forumUuid })',
    'MERGE (t)-[:HAS_TAG]->(tag)',
  ].join(' '),
);

const CREATE_TOPIC = [
  'MERGE (t:DiscourseTopic { id: $topic.id, forumUuid: $topic.forumUuid })',
  'ON CREATE SET',
  't.id = $topic.id,',
  't.forumUuid = $topic.forumUuid,',
  't.title = $topic.title,',
  't.fancyTitle = $topic.fancyTitle,',
  't.slug = $topic.slug,',
  't.createdAt = $topic.createdAt,',
  't.deletedAt = $topic.deletedAt,',
  't.imageUrl = $topic.imageUrl,',
  // 't.proposalId = $topic.proposalId,',
  // 't.voteType = $topic.voteType,',
  't.visible = $topic.visible,',
  't.closed = $topic.closed,',
  't.archived = $topic.archived',
  'ON MATCH SET',
  't.title = $topic.title,',
  't.fancyTitle = $topic.fancyTitle,',
  't.createdAt = $topic.createdAt,',
  't.deletedAt = $topic.deletedAt,',
  't.imageUrl = $topic.imageUrl,',
  // 't.proposalId = $topic.proposalId,',
  // 't.voteType = $topic.voteType',
  't.visible = $topic.visible,',
  't.closed = $topic.closed,',
  't.archived = $topic.archived',
  'WITH t',
  'MERGE (c:DiscourseCategory { id: $topic.categoryId, forumUuid: $topic.forumUuid })',
  'ON CREATE SET c.id = $topic.categoryId',
  'MERGE (c)-[:HAS_TOPIC]->(t)',
  'WITH t',
  // Add Tags
  'UNWIND $tagIds AS tagId',
  'MERGE (tag:DiscourseTag { id: tagId, forumUuid: $topic.forumUuid })',
  'ON CREATE SET',
  'tag.id = tagId,',
  'tag.name = tagId',
  'MERGE (t)-[:HAS_TAG]->(tag)',
  'RETURN t',
].join(' ');

const CREATE_POST = [
  // Step 1: Create or update the Post
  'MERGE (p: DiscoursePost { topicId: $post.topicId, postNumber: $post.postNumber, forumUuid: $post.forumUuid })',
  'ON CREATE SET',
  'p.id = $post.id,',
  'p.topicId = $post.topicId,',
  'p.forumUuid = $post.forumUuid,',
  'p.createdAt = $post.createdAt,',
  'p.updatedAt = $post.updatedAt,',
  'p.deletedAt = $post.deletedAt,',
  'p.postNumber = $post.postNumber,',
  'p.postType = $post.postType,',
  'p.replyToPostNumber = $post.replyToPostNumber,',
  'p.hidden = $post.hidden,',
  'p.cooked = $post.cooked,',
  'p.raw = $post.raw,',
  'p.score = $post.score',
  'ON MATCH SET',
  'p.createdAt = $post.createdAt,',
  'p.updatedAt = $post.updatedAt,',
  'p.deletedAt = $post.deletedAt,',
  'p.postNumber = $post.postNumber,',
  'p.replyToPostNumber = $post.replyToPostNumber,',
  'p.hidden = $post.hidden,',
  'p.cooked = $post.cooked,',
  'p.raw = $post.raw,',
  'p.score = $post.score',
  // Step 5: Create a Topic if it doesn't exist
  'WITH p',
  'MERGE (t:DiscourseTopic { id: $post.topicId, forumUuid: $post.forumUuid })',
  'ON CREATE SET',
  't.topicId = $post.topicId,',
  't.forumUuid = $post.forumUuid',
  // Step 6: Create a HAS_POST edge if it doesn't exist
  'MERGE (t)-[:HAS_POST]->(p)',
  'RETURN p',
].join(' ');

const CREATE_USER = [
  // Step 1: Create or update the User
  'MERGE (u: DiscourseUser { id: $user.id, forumUuid: $user.forumUuid })',
  'ON CREATE SET',
  'u.id = $user.id,',
  'u.forumUuid = $user.forumUuid,',
  'u.username = $user.username,',
  'u.createdAt = $user.createdAt,',
  'u.name = $user.name,',
  'u.title = $user.title,',
  'u.trustLevel = $user.trustLevel,',
  'u.moderator = $user.moderator,',
  'u.admin = $user.admin,',
  'u.avatarTemplate = $user.avatarTemplate,',
  'u.locale = $user.locale,',
  'u.invitedById = $user.invitedById',
  'ON MATCH SET',
  'u.username = $user.username,',
  'u.createdAt = $user.createdAt,',
  'u.name = $user.name,',
  'u.title = $user.title,',
  'u.trustLevel = $user.trustLevel,',
  'u.moderator = $user.moderator,',
  'u.admin = $user.admin,',
  'u.avatarTemplate = $user.avatarTemplate,',
  'u.locale = $user.locale,',
  'u.invitedById = $user.invitedById',
  // Create a HAS_JOINED edge if it doesn't exist
  'MERGE (f:DiscourseForum { uuid: $user.forumUuid })',
  'MERGE (u)-[:HAS_JOINED]->(f)',
  // Return user
  'RETURN u',
].join(' ');

const BULK_CREATE_USER_BADGES = [
  'UNWIND $userBadges AS userBadge',
  'MERGE (u:DiscourseUser { id: userBadge.userId, forumUuid: userBadge.forumUuid })',
  'MERGE (b:DiscourseBadge { id: userBadge.badgeId, forumUuid: userBadge.forumUuid })',
  'MERGE (u)-[hb:HAS_BADGE]->(b)',
  'SET hb.grantedById = userBadge.gratedById',
].join(' ');

const CREATE_POST_USER = [
  // Step 2: Create a User if it doesn't exist
  'MERGE (u:DiscourseUser { id: $post.userId, forumUuid: $post.forumUuid })',
  'ON CREATE SET',
  'u.id = $post.userId,',
  'u.forumUuid = $post.forumUuid,',
  'u.username = $post.username,',
  'u.userDeleted = $post.userDeleted',
  // Step 3: Create a HAS_JOINED edge if it doesn't exist
  'WITH u',
  'MERGE (f:DiscourseForum { uuid: u.forumUuid })',
  'MERGE (u)-[:HAS_JOINED]->(f)',
  // Step 4: Create a POSTED edge if it doesn't exist
  'WITH u',
  'MERGE (p:DiscoursePost { id: $post.id, forumUuid: $post.forumUuid })',
  'MERGE (u)-[:POSTED]->(p)',
].join(' ');

const CREATE_REPLIED_TO_EDGE = [
  // Step 1: Handling replyToPostNumber
  'MERGE (p:DiscoursePost { id: $post.id, forumUuid: $post.forumUuid })',
  'WITH p',
  'WHERE $post.replyToPostNumber IS NOT NULL',
  'MERGE (rp:DiscoursePost { postNumber: $post.replyToPostNumber, topicId: $post.topicId, forumUuid: $post.forumUuid })',
  'ON CREATE SET',
  'rp.postNumber = $post.replyToPostNumber,',
  'rp.topicId = $post.topicId,',
  'rp.forumUuid = $post.forumUuid',
  // Step 2: Create a REPLIED edge if it doesn't exist
  'MERGE (p)-[:REPLIED_TO]->(rp)',
].join(' ');

const GET_ALL_FORUMS = 'MATCH (f:DiscourseForum) RETURN f';

export const CYPHERS = {
  BULK_CREATE_BADGE_TYPE,
  BULK_CREATE_BADGE_GROUPING,
  BULK_CREATE_BADGE,
  BULK_CREATE_TAG_GROUP,
  BULK_CREATE_TAG,
  BULK_CREATE_GROUP,
  BULK_CREATE_CATEGORY,
  BULK_CREATE_TOPIC,
  BULK_CREATE_POST,
  // BULK_CREATE_USER,
  BULK_CREATE_GROUP_MEMBERS,
  BULK_CREATE_GROUP_OWNERS,
  BULK_CREATE_ACTION,
  BULK_CREATE_USER_BADGE,
  BULK_CREATE_TOPIC_TAG,
  CREATE_TOPIC,
  CREATE_POST,
  CREATE_USER,
  BULK_CREATE_USER_BADGES,
  CREATE_POST_USER,
  CREATE_REPLIED_TO_EDGE,
  GET_ALL_FORUMS,
};
