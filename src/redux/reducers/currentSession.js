const INITIAL_STATE = {
  lastSeenTag: null,
  breathCount: 0,
};
const currentSession = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_BREATH_COUNT':
      return {
        ...state,
        breathCount: state.breathCount + 1,
      };
    case 'SEEN_TAG':
      return {
        ...state,
        lastSeenTag: action.tag,
      };
    default:
      return state;
  }
};

export default currentSession;
