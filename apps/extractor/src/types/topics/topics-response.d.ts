type TopicsResponse = {
  users: BasicUser[];
  primary_groups: any[];
  topic_list: {
    can_create_topic: boolean;
    draft?: string;
    draft_key: string;
    draft_sequence: number;
    per_page: number;
    more_topics_url?: string;
    topics: Topic[];
  };
};
