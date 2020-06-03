const initialState = {
  breathingGamePlayed: false,
  firstContentViewed: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYED_BREATHING_GAME_FIRST_TIME':
      return {
        ...state,
        breathingGamePlayed: true,
      };
    case 'VIEWED_CONTENT_FIRST_TIME':
      return {
        ...state,
        firstContentViewed: true,
      };

    default:
      return state;
  }
};

export default firstLaunch;
