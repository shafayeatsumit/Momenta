const initialState = {
  breathingGameFirstRun: true,
  firstContentViewed: false,
  viewedGameExplainer: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYED_BREATHING_GAME':
      return {
        ...state,
        breathingGameFirstRun: false,
      };
    default:
      return state;
  }
};

export default firstLaunch;
