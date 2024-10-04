export const Patterns = {
  Graph: {
    BadgeGrouping: {
      Create: 'Graph.BadgeGrouping.Create',
    },
    BadgeType: {
      Create: 'Graph.BadgeType.Create',
    },
    Badge: {
      Create: 'Graph.Badge.Create',
    },
    Category: {
      Create: 'Graph.Category.Create',
    },
    Group: {
      Create: 'Graph.Group.Create',
    },
    Post: {
      Create: 'Graph.Post.Create',
      UpdateRepliedTo: 'Graph.Post.UpdateRepliedTo',
      LatestById: 'Graph.Post.LatestById',
    },
    Topic: {
      Create: 'Graph.Topic.Create',
      LatestById: 'Graph.Topic.LatestById',
    },
    TagGroup: {
      Create: 'Graph.TagGroup.Create',
    },
    Tag: {
      Create: 'Graph.Tag.Create',
    },
    User: {
      Create: 'Graph.User.Create',
      GetUniqueUsersByPosts: 'Graph.User.GetUniqueUsersByPosts',
    },
    UserAction: {
      Create: 'Graph.UserAction.Create',
    },
  },
  Mongo: {
    Platform: {
      Find: 'Mongo.Platform.Find',
      FindById: 'Mongo.Platform.FindById',
      UpdateOne: 'Mongo.Platform.UpdateOne',
    },
  },
};
