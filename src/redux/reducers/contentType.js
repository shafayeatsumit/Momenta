const contentType = (state = null, action) => {
  switch (action.type) {
    case 'SET_CONTENT_TYPE':
      return action.contentType;
    default:
      return state;
  }
};

export default contentType;
