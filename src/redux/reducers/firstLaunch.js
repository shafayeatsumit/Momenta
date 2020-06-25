const initialState = {
  breathCount: 0,
  onboardingCompleted: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_USER_ONBOARDING_COMPLETED':
      return {
        ...state,
        onboardingCompleted: true,
        breathCount: state.breathCount + 1,
      };
    case 'NEW_USER_INCREASE_BREATH_COUNT':
      const updatedBreathCount = state.breathCount + 1;
      return {
        ...state,
        breathCount: updatedBreathCount,
      };
    default:
      return state;
  }
};

export default firstLaunch;
