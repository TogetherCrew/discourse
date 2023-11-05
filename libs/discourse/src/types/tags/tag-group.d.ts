type TagGroup = {
  id: number;
  name: string;
  tag_names: any[];
  parent_tag_name: any[];
  one_per_topic: boolean;
  permissions: {
    staff: number;
  };
};
