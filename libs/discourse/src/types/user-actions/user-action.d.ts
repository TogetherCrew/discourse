type UserAction = {
  excerpt: string;
  action_type: number;
  created_at: string;
  avatar_template: string;
  acting_avatar_template: string;
  slug: string;
  topic_id: number;
  target_user_id: number;
  target_name?: string;
  target_username: string;
  post_number: number;
  post_id?: string;
  username: string;
  name?: string;
  user_id: number;
  acting_username: string;
  acting_name?: string;
  acting_user_id: number;
  title: string;
  deleted: boolean;
  hidden?: string;
  post_type?: string;
  action_code?: string;
  category_id: number;
  closed: boolean;
  archived: boolean;
};
