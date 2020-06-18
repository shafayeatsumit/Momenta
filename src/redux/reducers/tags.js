const tags = (state = {}, action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        ...action.tags,
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        ...action.tags,
      };
    case 'UPDATE_FAVORITES':
      return {
        ...state,
        ...action.tags,
      };
    default:
      return state;
  }
};

const tagNames = (state = [], action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return [...state, ...action.tagNames];
    case 'UPDATE_ACTIVE_TAG':
      return action.tags;
    default:
      return state;
  }
};

export {tags, tagNames};
