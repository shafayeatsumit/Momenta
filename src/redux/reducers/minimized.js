const minimized = (state = false, action) => {
  switch (action.type) {
    case 'SET_MINIMIZE_TRUE':
      return true;
    case 'RESET_CATEGORIES_CONTENT':
    case 'SET_CONTENT_TYPE':
    case 'RESET_BOOKMARKS':
    case 'CHOOSE_SINGLE_CATEGORY':
    case 'SET_MINIMIZE_FALSE':
      return false;
    default:
      return state;
  }
};

export default minimized;
