const contentType = (state = null, action) => {
  switch (action.type) {
    case 'START_FROM_SPECIFIC_BOOKMARK_SET':
      return 'bookmarks';
    case 'SET_CONTENT_TYPE':
      return action.contentType;
    default:
      return state;
  }
};

export default contentType;
