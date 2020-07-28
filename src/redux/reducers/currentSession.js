const INITIAL_STATE = {
  lastSeenTag: null,
  breathCount: 0,
  additionalBreath: 0,
};
const currentSession = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_BREATH_COUNT':
      return {
        ...state,
        breathCount: state.breathCount + 1,
      };
    case 'ONBOARDING_ADD_BREATH_COUNT':
      return {
        ...state,
        breathCount: state.breathCount + 1,
      };
    case 'LAST_SEEN_TAG':
      return {
        ...state,
        lastSeenTag: action.tag,
      };
    case 'PICK_BREATH_PER_SESSION':
    case 'RESET_BREATH_COUNT':
      return {
        ...state,
        breathCount: 0,
        additionalBreath: 0,
      };
    case 'ADD_EXTRA_BREATH':
      return {
        ...state,
        additionalBreath: state.additionalBreath + action.breathCount,
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
