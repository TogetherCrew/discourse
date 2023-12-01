type Topic = {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string;
  created_at: Date;
  deleted_at?: Date;
  last_posted_at: Date;
  bumped: boolean;
  bumped_at: Date;
  archetype: string;
  unseen: boolean;
  last_read_post_number: number;
  unread_posts: number;
  pinned: boolean;
  unpinned?: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  notification_level: number;
  bookmarked: boolean;
  liked: boolean;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  op_like_count: number;
  pinned_globally: boolean;
  featured_link?: string;
  posters: Poster[];
  tags: any[];
  post_stream: {
    posts: Post[];
    stream: any[];
  };
};
