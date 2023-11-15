type GroupMembersResponse = {
  members: GroupMember[];
  owners: GroupMember[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};
