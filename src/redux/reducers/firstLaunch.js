const initialState = {
  playCount: 1,
  tutorialFinished: false,
};

const firstLaunch = (state = initialState, action) => {
  switch (action.type) {
    case 'FINISHED_TUTORIAL':
      return {
        ...state,
        tutorialFinished: true,
      };
    default:
      return state;
  }
};

export default firstLaunch;
