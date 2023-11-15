type DetailUser = {
  active: boolean;
  admin: boolean;
  moderator: boolean;
  last_seen_at?: string;
  last_emailed_at?: string;
  created_at: string;
  last_seen_age?: number;
  last_emailed_age?: number;
  created_at_age?: number;
  manual_locked_trust_level?: string;
  title?: string;
  time_read: number;
  staged: boolean;
  days_visited: number;
  posts_read_count: number;
  topics_entered: number;
  post_count: number;
  associated_accounts: any[];
  can_send_activation_email: boolean;
  can_activate: boolean;
  can_deactivate: boolean;
  ip_address: string;
  registration_ip_address?: string;
  can_grant_admin: boolean;
  can_revoke_admin: boolean;
  can_grant_moderation: boolean;
  can_revoke_moderation: boolean;
  can_impersonate: boolean;
  like_count: number;
  like_given_count: number;
  topic_count: number;
  flags_given_count: number;
  flags_received_count: number;
  private_topics_count: number;
  can_delete_all_posts: boolean;
  can_be_deleted: boolean;
  can_be_anonymized: boolean;
  can_be_merged: boolean;
  full_suspend_reason?: string;
  silence_reason?: string;
  post_edits_count?: number;
  primary_group_id?: string;
  badge_count: number;
  warnings_received_count: number;
  bounce_score?: number;
  reset_bounce_score_after?: string;
  can_view_action_logs: boolean;
  can_disable_second_factor: boolean;
  can_delete_sso_record: boolean;
  api_key_count: number;
  single_sign_on_record?: string;
  approved_by?: object;
  suspended_by?: string;
  silenced_by?: string;
  penalty_counts: object;
  next_penalty: string;
  tl3_requirements: object;
  groups: object[];
  external_ids: object;
};