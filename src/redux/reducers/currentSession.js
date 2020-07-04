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
    case 'LAST_SEEN_TAG':
      return {
        ...state,
        lastSeenTag: action.tag,
      };
    case 'RESET_BREATH_COUNT':
      return {
        ...state,
        breathCount: 0,
      };
    case 'RESET_SESSION':
      return {
        ...state,
        lastSeenTag: null,
        breathCount: 0,
      };
    default:
      return state;
  }
};

export default currentSession;