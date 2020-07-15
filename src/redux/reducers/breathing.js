const initialState = {
  breathCountToday: 0,
  lastBreathTaken: null,
  breathingTips: [],
  showTips: true,
};

const getTodaysDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  return date;
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_BREATH_COUNT':
      const date = getTodaysDate();
      const breathCount =
        state.lastBreathTaken !== date && state.lastBreathTaken !== null
          ? 0
          : state.breathCountToday + 1;
      return {
        ...state,
        breathCountToday: breathCount,
        lastBreathTaken: date,
      };
    default:
      return state;
  }
};

export default breathing;
