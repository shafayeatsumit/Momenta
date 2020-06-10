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
    default:
      return state;
  }
};

const tagNames = (state = [], action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return [...state, ...action.tagNames];

    default:
      return state;
  }
};

const selectedTags = (state = [], action) => {
  switch (action.type) {
    case 'SELECT_TAG':
      return [...state, action.tagId];

    case 'DESELECT_TAG':
      return state.filter((tag) => tag !== action.tagId);

    default:
      return state;
  }
};
export {tags, tagNames, selectedTags};
