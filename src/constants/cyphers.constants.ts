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

const BULK_CREATE_BADGE_TYPE = generateCypher(
  'UNWIND $batch AS badgeType RETURN badgeType',
  'MERGE (b:BadgeType { id: badgeType.id, forumUuid: badgeType.forumUuid }) SET b = badgeType',
);

const BULK_CREATE_BADGE_GROUPING = generateCypher(
  'UNWIND $batch AS badgeGrouping return badgeGrouping',
  'MERGE (b:BadgeGrouping { id: badgeGrouping.id, forumUuid: badgeGrouping.forumUuid }) SET b = badgeGrouping',
);

const BULK_CREATE_BADGE = generateCypher(
  'UNWIND $batch AS badge return badge',
  [
    'MERGE (bg:BadgeGrouping {id: badge.badgeGroupingId, forumUuid: badge.forumUuid })',
    'MERGE (bt:BadgeType {id: badge.badgeTypeId, forumUuid: badge.forumUuid })',
    'MERGE (b:Badge { id: badge.id, forumUuid: badge.forumUuid }) SET b = badge',
    'MERGE (b)-[:HAS_GROUPING]->(bg)',
    'MERGE (b)-[:HAS_TYPE]->(bt)',
  ].join(' '),
);

const BULK_CREATE_TAG_GROUP = generateCypher(
  'UNWIND $batch AS tagGroup RETURN tagGroup',
  [
    'MERGE (tg:TagGroup { id: tagGroup.id, forumUuid: tagGroup.forumUuid })',
    'SET tg.name = tagGroup.name',
    'WITH tg, tagGroup.tags AS tags',
    'UNWIND tags as tag',
    'MERGE (t:Tag { id: tag.id, forumUuid: tg.forumUuid }) SET t = tag',
    'SET t.forumUuid = tg.forumUuid',
    'MERGE (tg)-[:CONTAINS]->(t)',
  ].join(' '),
);

const BULK_CREATE_TAG = generateCypher(
  'UNWIND $batch AS tag RETURN tag',
  'MERGE (t:Tag { id: tag.id, forumUuid: tag.forumUuid}) SET t = tag',
);

const BULK_CREATE_GROUP = generateCypher(
  'UNWIND $batch AS group RETURN group',
  'MERGE (g:Group { id: group.id, forumUuid: group.forumUuid }) SET g = group',
);

const BULK_CREATE_GROUP_MEMBERS = generateCypher(
  'UNWIND $batch AS member RETURN member',
  [
    'MERGE(u:User { id: member.id, forumUuid: member.forumUuid }) SET u = member',
    'MERGE(g:Group { id: $groupId, forumUuid: member.forumUuid })',
    'MERGE (g)-[:HAS_MEMBER]->(u)',
  ].join(' '),
  '{ batch: $batch, groupId: $groupId }',
);

const BULK_CREATE_GROUP_OWNERS = generateCypher(
  'UNWIND $batch AS owner RETURN owner',
  [
    'MERGE(u:User { id: owner.id, forumUuid: owner.forumUuid }) SET u = owner',
    'MERGE(g:Group { id: $groupId, forumUuid: owner.forumUuid })',
    'MERGE (g)-[:HAS_OWNER]->(u)',
  ].join(' '),
  '{ batch: $batch, groupId: $groupId }',
);

const BULK_CREATE_CATEGORY = generateCypher(
  'UNWIND $batch AS category RETURN category',
  'MERGE (c:Category { id: category.id, forumUuid: category.forumUuid }) SET c += category',
);

const BULK_CREATE_TOPIC = generateCypher(
  'UNWIND $batch AS topic RETURN topic',
  [
    'MERGE (t:Topic { id: topic.id, forumUuid: topic.forumUuid }) SET t = topic',
    'MERGE (c:Category { id: t.categoryId, forumUuid: t.forumUuid })',
    'MERGE (c)-[:HAS_TOPIC]->(t)',
  ].join(' '),
);

const BULK_CREATE_POST = generateCypher(
  'UNWIND $batch AS post RETURN post',
  [
    'MERGE (t:Topic { id: post.topicId, forumUuid: post.forumUuid })',
    'MERGE (u:User { id: post.userId, forumUuid: post.forumUuid })',
    'MERGE (p:Post { id: post.id, forumUuid: post.forumUuid }) SET p = post',
    'MERGE (u)-[r:POSTED]->(p)',
    'MERGE (t)-[:HAS_POST]->(p)',
    'ON CREATE SET r.createdAt = p.createdAt',
    'WITH p, post',
    'WHERE post.replyToPostNumber IS NOT NULL',
    'MERGE (rT:Post { postNumber: post.replyToPostNumber, topicId: post.topicId, forumUuid: post.forumUuid })',
    'MERGE (p)-[:REPLIED]->(rT)',
  ].join(' '),
);

const BULK_CREATE_USER = generateCypher(
  'UNWIND $batch AS user RETURN user',
  [
    'MATCH (f:Forum { uuid: user.forumUuid })', // This is a MATCH because we don't want to recreate a forum
    'MERGE (u:User { id: user.id, forumUuid: user.forumUuid }) SET u = user',
    'MERGE (u)-[:HAS_JOINED]->(f)',
  ].join(' '),
);

const BULK_CREATE_ACTION = generateCypher(
  'UNWIND $batch AS action RETURN action',
  [
    // LIKE = 1
    'WHERE action.actionType = 1',
    'MERGE (u:User { id: action.actingUserId, forumUuid: action.forumUuid })',
    'MERGE (p:Post { id: action.postId, forumUuid: action.forumUuid })',
    'MERGE (u)-[:LIKED { createdAt: action.createdAt, deleted: action.deleted }]->(p)',
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
    'MERGE(b:Badge { id: userBadge.badgeId, forumUuid: userBadge.forumUuid })',
    'MERGE(u:User { id: userBadge.userId, forumUuid: userBadge.forumUuid })',
    'MERGE (u)-[r:HAS_BADGE]->(b)',
    "SET r += apoc.map.removeKeys(userBadge, ['badgeId', 'userId'])",
  ].join(' '),
);

const BULK_CREATE_TOPIC_TAG = generateCypher(
  'UNWIND $batch AS topicTag RETURN topicTag',
  [
    'MERGE (tag:Tag { id: topicTag.tagId, forumUuid: topicTag.forumUuid })',
    'MERGE (t:Topic { id: topicTag.topicId, forumUuid: topicTag.forumUuid })',
    'MERGE (t)-[:HAS_TAG]->(tag)',
  ].join(' '),
);

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
  BULK_CREATE_USER,
  BULK_CREATE_GROUP_MEMBERS,
  BULK_CREATE_GROUP_OWNERS,
  BULK_CREATE_ACTION,
  BULK_CREATE_USER_BADGE,
  BULK_CREATE_TOPIC_TAG,
};
