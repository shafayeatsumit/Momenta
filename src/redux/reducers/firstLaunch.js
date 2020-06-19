const initialState = {
  playCount: 1,
  onboardingDone: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_USER_ONBOARDING_DONE':
      return {
        ...state,
        onboardingDone: true,
      };
    case 'NEW_USER_INCREASE_PLAY_COUNT':
      const updatedPlayCount = state.playCount + 1;
      return {
        ...state,
        playCount: updatedPlayCount,
      };
    default:
      return state;
  }
};

export default firstLaunch;
