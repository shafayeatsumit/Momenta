const INITIAL_STATE = {
  tag: null,
  set: null,
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
        tag: action.tag,
        set: action.set,
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
