type Post = {
  id: number;
  username: string;
  avatar_template: string;
  created_at: string;
  cooked: string;
  post_number: number;
  post_type: number;
  updated_at: string;
  reply_count: number;
  reply_to_post_number?: string;
  quote_count: number;
  incoming_link_count: number;
  reads: number;
  readers_count: number;
  score: number;
  yours: boolean;
  topic_id: number;
  topic_slug: string;
  primary_group_name?: string;
  flair_name?: string;
  flair_url?: string;
  flair_bg_color?: string;
  flair_color?: string;
  flair_group_id?: string;
  version: number;
  can_edit: boolean;
  can_delete: boolean;
  can_recover: boolean;
  can_see_hidden_post: boolean;
  can_wiki: boolean;
  user_title?: string;
  bookmarked: boolean;
  raw: string;
  actions_summary: ActionSummary[];
  moderator: boolean;
  admin: boolean;
  staff: boolean;
  user_id: number;
  hidden: boolean;
  trust_level: number;
  deleted_at?: string;
  user_deleted: boolean;
  edit_reason?: string;
  can_view_edit_history: boolean;
  wiki: boolean;
  reviewable_id?: string;
  reviewable_score_count: number;
  reviewable_score_pending_count: number;
  mentioned_users: any[];
  name?: string;
  display_username?: string;
  [key: string]: any; // This allows for an additional property of any type with any name.
};
