const initialState = {
  breathCountToday: 0,
  lastBreathTaken: null,
  lastBreathingTipSeen: null,
  breathingTips: [],
};

const getTodaysDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  return date;
};

const breathing = (state = initialState, action) => {
  const date = getTodaysDate();
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        breathingTips: action.breathingTips,
      };
    case 'ADD_BREATH_COUNT':
      const breathCount =
        state.lastBreathTaken !== date && state.lastBreathTaken !== null
          ? 0
          : state.breathCountToday + 1;
      return {
        ...state,
        breathCountToday: breathCount,
        lastBreathTaken: date,
      };
    case 'SEEN_BREATHING_TIP':
      const tips = state.breathingTips.map((tip) =>
        tip.id === action.tipId ? {...tip, lastSeen: date} : tip,
      );
      return {
        ...state,
        breathingTips: tips,
      };
    default:
      return state;
  }
};

export default breathing;
