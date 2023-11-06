type GroupsResponse = {
  groups: Group[];
  extras: {
    type_filters: any[];
  };
  total_rows_groups: number;
  load_more_groups: string;
};
