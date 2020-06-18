const initialState = {
  playCount: 1,
  onboardingDone: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'ONBOARDING_DONE':
      return {
        ...state,
        onboardingDone: true,
        playCount: state.playCount + 1,
      };
    case 'INCREASE_PLAY_COUNT':
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
