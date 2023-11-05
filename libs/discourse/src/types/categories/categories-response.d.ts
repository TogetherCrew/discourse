type CategoriesResponse = {
  category_list: {
    can_create_category: boolean;
    can_create_topic: boolean;
    categories: Category[];
  };
};
