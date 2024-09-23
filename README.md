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