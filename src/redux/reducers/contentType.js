const contentType = (state = null, action) => {
  switch (action.type) {
    case 'SHUFFLE_ON_START_FROM_SPECIFIC_BOOKMARK_SET':
    case 'START_FROM_SPECIFIC_BOOKMARK_SET':
      return 'bookmarks';
    case 'SET_CONTENT_TYPE':
      return action.contentType;
    case 'CHOOSE_SINGLE_TAG':
      return 'regular';
    default:
      return state;
  }
};

export default contentType;
