const INITIAL_STATE = {
  tagId: null,
  setId: null,
  tagName: null,
};

const onScreen = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_ONSCREEN_CONTENT':
      return {
        ...state,
        ...action.payload,
      };
    case 'NEXT_SET':
      return {
        ...state,
        tagId: action.tagId,
        setId: action.setId,
        tagName: action.tagName,
      };
    case 'RESET_CONTENT':
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default onScreen;
