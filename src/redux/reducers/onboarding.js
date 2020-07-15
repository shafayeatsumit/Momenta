const INIT_STATE = {
  completed: false,
  breathingTutorial: true,
  breathCount: 0,
};

const onboarding = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'ONBOARDING_ADD_BREATH_COUNT':
      return {
        ...state,
        breathCount: state.breathCount + 1,
      };
    case 'FINISH_TUTORIAL':
      return {
        ...state,
        breathingTutorial: false,
      };
    case 'ONBOARDING_COMPLETED':
      return {
        ...state,
        completed: true,
      };
    default:
      return state;
  }
};

export default onboarding;
