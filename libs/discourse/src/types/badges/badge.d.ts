type Badge = {
  id: number;
  name: string;
  description: string;
  grant_count: number;
  allow_title: boolean;
  multiple_grant: boolean;
  icon: string;
  image_url?: string;
  listable: boolean;
  enabled: boolean;
  badge_grouping_id: number;
  system: boolean;
  long_description: string;
  slug: string;
  manually_grantable: boolean;
  query?: string;
  trigger?: number;
  target_posts: boolean;
  auto_revoke: boolean;
  show_posts: boolean;
  i18n_name?: string;
  badge_type_id: number;
};