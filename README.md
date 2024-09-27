# Neo4j Constraints

```
CREATE CONSTRAINT FOR (c:DiscourseBadgeGrouping) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseBadgeType) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseBadge) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseGroup) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseCategory) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseTopic) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscoursePost) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseTagGroup) REQUIRE (c.id, c.endpoint) IS UNIQUE;
CREATE CONSTRAINT FOR (c:DiscourseTag) REQUIRE (c.id, c.endpoint) IS UNIQUE;
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