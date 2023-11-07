const PREPEND = 'CALL apoc.periodic.iterate(';
const CONFIG =
  '{ batchSize: 10000, parallel: true, params: { batch: $batch } }';
const POSTPEND = ')';
const COMMA = ',';

function generateCypher(cypherIterate: string, cypherAction: string): string {
  return [
    PREPEND,
    `"${cypherIterate}"`,
    COMMA,
    `"${cypherAction}"`,
    COMMA,
    CONFIG,
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
  'CREATE (tg:TagGroup { id: tagGroup.id, forumUuid: tagGroup.forumUuid }) SET tg = tagGroup',
);

const BULK_CREATE_TAG = generateCypher(
  'UNWIND $batch AS tag RETURN tag',
  'MERGE (t:Tag { id: tag.id, forumUuid: tag.forumUuid}) SET t = tag',
);

const BULK_CREATE_GROUP = generateCypher(
  'UNWIND $batch AS group RETURN group',
  'MERGE (g:Group { id: group.id, forumUuid: group.forumUuid }) SET g = group',
);

const BULK_CREATE_CATEGORY = generateCypher(
  'UNWIND $batch AS category RETURN category',
  'MERGE (c:Category { id: category.id, forumUuid: category.forumUuid }) SET c = category',
);

const BULK_CREATE_TOPIC = generateCypher(
  'UNWIND $batch AS topic RETURN topic',
  [
    'MERGE (c:Category { id: topic.categoryId, forumUuid: topic.forumUuid })',
    'MERGE (t:Topic { id: topic.id, forumUuid: topic.forumUuid }) SET t = topic',
    'MERGE (c)-[:HAS_TOPIC]->(t)',
  ].join(' '),
);

const BULK_CREATE_POST = [
  'UNWIND $batch AS post',
  // 'MERGE (f:Forum {uuid: topic.forumUuid })',
  'MERGE (t:Topic { id: post.topicId, forumUuid: post.forumUuid })',
  'CREATE (p:Post) SET p = post',
  // 'MERGE (f)-[:HAS_TOPIC]->(g)',
  'MERGE (t)-[:HAS_POST]->(p)',
].join(' ');

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
};
