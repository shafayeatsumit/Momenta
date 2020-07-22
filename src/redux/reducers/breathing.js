const initialState = {
  lastBreathingTipSeen: null,
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
  const date = getTodaysDate();
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        breathingTips: [...state.breathingTips, ...action.breathingTips],
      };

    case 'SEEN_BREATHING_TIP':
      const tips = state.breathingTips.map((tip) =>
        tip.id === action.tipId ? {...tip, lastSeen: date} : tip,
      );
      return {
        ...state,
        breathingTips: tips,
        lastBreathingTipSeen: date,
      };
    case 'DONT_SHOW_FOCUS_TODAY':
      return {
        ...state,
        showTips: !state.showTips,
      };
    case 'TODAYS_FOCUS_ON':
      return {
        ...state,
        showTips: true,
      };
    default:
      return state;
  }
};

export default breathing;
