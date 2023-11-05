const BULK_CREATE_BADGE_TYPE = [
  'UNWIND $batch AS badgeType',
  // 'MERGE (f:Forum {uuid: badgeType.forumUuid})',
  'CREATE (b:BadgeType) SET b = badgeType',
  // 'MERGE (f)-[:HAS_BADGE_TYPE]->(b)',
].join(' ');

const BULK_CREATE_BADGE_GROUPING = [
  'UNWIND $batch AS badgeGrouping',
  // 'MERGE (f:Forum {uuid: badgeGrouping.forumUuid})',
  'CREATE (b:BadgeGrouping) SET b = badgeGrouping',
  // 'MERGE (f)-[:HAS_BADGE_GROUPING]->(b)',
].join(' ');

const BULK_CREATE_BADGE = [
  'UNWIND $batch AS badge',
  // 'MERGE (f:Forum {uuid: badge.forumUuid})',
  'MERGE (bg:BadgeGrouping {id: badge.badgeGroupingId, forumUuid: badge.forumUuid})',
  'MERGE (bt:BadgeType {id: badge.badgeTypeId, forumUuid: badge.forumUuid})',
  'CREATE (b:Badge) SET b = badge',
  // 'MERGE (f)-[:HAS_BADGE]->(b)',
  'MERGE (b)-[:HAS_GROUPING]->(bg)',
  'MERGE (b)-[:HAS_TYPE]->(bt)',
].join(' ');

const BULK_CREATE_TAG_GROUP = [
  'UNWIND $batch AS tagGroup',
  // 'MERGE (f:Forum {uuid: tagGroup.forumUuid})',
  'CREATE (t:TagGroup) SET t = tagGroup',
  // 'MERGE (f)-[:HAS_BADGE_TYPE]->(b)',
].join(' ');

const BULK_CREATE_TAG = [
  'UNWIND $batch AS tag',
  // 'MERGE (f:Forum {uuid: tag.forumUuid})',
  // 'MERGE (tg:TagGroup {id: tag.tagGroupId, forumUuid: tag.forumUuid})',
  'CREATE (t:Tag) SET t = tag',
  // 'MERGE (f)-[:HAS_TAG]->(t)',
  // 'MERGE (tg)-[:CONTAINS]->(t)',
].join(' ');

const BULK_CREATE_GROUP = [
  'UNWIND $batch AS group',
  // 'MERGE (f:Forum {uuid: group.forumUuid})',
  'CREATE (g:Group) SET g = group',
  // 'MERGE (f)-[:HAS_GROUP]->(g)',
].join(' ');

const BULK_CREATE_CATEGORY = [
  'UNWIND $batch AS category',
  // 'MERGE (f:Forum {uuid: category.forumUuid})',
  'CREATE (c:Category) SET c = category',
  // 'MERGE (f)-[:HAS_BADGE_TYPE]->(b)',
].join(' ');

export const CYPHERS = {
  BULK_CREATE_BADGE_TYPE,
  BULK_CREATE_BADGE_GROUPING,
  BULK_CREATE_BADGE,
  BULK_CREATE_TAG_GROUP,
  BULK_CREATE_TAG,
  BULK_CREATE_GROUP,
  BULK_CREATE_CATEGORY,
};
