# Neo4j Constraints

```
CREATE CONSTRAINT FOR (obj:DiscourseBadgeGrouping) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseBadgeType) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseBadge) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseGroup) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseCategory) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseTagGroup) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseTag) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscoursePost) REQUIRE (obj.topicId, obj.endpoint, obj.postNumber) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscoursePost) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (obj:DiscourseTopic) REQUIRE (obj.id, obj.endpoint) IS UNIQUE;
```


### Process

forumMaster
  topicMaster
    /latest.json
    [iterate]
  postMaster
    /posts.json
    [iterate]
  badges
    /badges.json
  categories
    /categories.json
  groups
    /groups.json
    [recursive] [load_more_groups]
  tagGroups
    /tag_groups.json
  tags
    /tags.json
  
  
  users
    [depends on postMaster]
    /u/{username}.json
    /user-badges/{username}.json
    /user-actions.json