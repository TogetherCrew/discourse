type DetailUser = BasicUser & {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  last_posted_at?: Date;
  last_seen_at?: Date;
  created_at: Date;
  ignored: boolean;
  muted: boolean;
  can_ignore_user: boolean;
  can_mute_user: boolean;
  can_send_private_messages: boolean;
  can_send_private_message_to_user: boolean;
  trust_level: number;
  moderator: boolean;
  admin: boolean;
  title?: string;
  badge_count: number;
  second_factor_backup_enabled: boolean;
  user_fields: any;
  custom_fields: any;
  time_read: number;
  recent_time_read: number;
  primary_group_id?: string;
  primary_group_name?: string;
  flair_group_id?: string;
  flair_name?: string;
  flair_url?: string;
  flair_bg_color?: string;
  flair_color: string;
  featured_topic: string;
  staged: boolean;
  can_edit: boolean;
  can_edit_username: boolean;
  can_edit_email: boolean;
  can_edit_name: boolean;
  uploaded_avatar_id?: string;
  has_title_badges: boolean;
  pending_count: number;
  pending_posts_count: number;
  profile_view_count: number;
  second_factor_enabled: boolean;
  can_upload_profile_header: boolean;
  can_upload_user_card_background: boolean;
  post_count: number;
  can_be_deleted: boolean;
  can_delete_all_posts: boolean;
  locale?: string;
  muted_category_ids: any[];
  regular_category_ids: any[];
  watched_tags: any[];
  watching_first_post_tags: any[];
  tracked_tags: any[];
  muted_tags: any[];
  tracked_category_ids: any[];
  watched_category_ids: any[];
  watched_first_post_category_ids: any[];
  system_avatar_upload_id?: string;
  system_avatar_template: string;
  muted_usernames: any[];
  ignored_usernames: any[];
  allowed_pm_usernames: any[];
  mailing_list_posts_per_day: number;
  can_change_bio: boolean;
  can_change_location: boolean;
  can_change_website: boolean;
  can_change_tracking_preferences: boolean;
  user_api_keys?: string;
  sidebar_tags: any[][]; // Array of arrays
  sidebar_category_ids: any[][]; // Array of arrays
  display_sidebar_tags: boolean;
  user_auth_tokens: any[]; // Array of anys
  user_notification_schedule: any;
  use_logo_small_as_avatar: boolean;
  featured_user_badge_ids: any[];
  invited_by?: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
  };
  groups: any[]; // Array of anys
  group_users: any[]; // Array of anys
  user_option: any; // Assuming this is an any, as no details were given
};
