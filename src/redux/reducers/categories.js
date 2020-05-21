const initialState = {
  items: [],
  selected: [],
};
const categories = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TAGS':
      return {
        ...state,
        items: [...state.items, ...action.tags],
      };
    case 'TOOGLE_SELECTED_TAG':
      return {
        ...state,
        selected: action.selectedTags,
      };
    case 'START_FROM_SPECIFIC_BOOKMARK_SET':
    case 'RESET_TAGS_CONTENT':
    case 'RESET_TAGS':
      return {
        ...state,
        selected: [],
      };

    default:
      return state;
  }
};

export default categories;
