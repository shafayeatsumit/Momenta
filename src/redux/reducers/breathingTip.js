const INITIAL_STATE = {id: null, sets: []};
const breathingTip = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        ...action.breathingTip,
      };
    case 'REARRANGE_BREATHING_TIP':
      return {
        ...state,
        sets: action.sets,
      };
    default:
      return state;
  }
};

export default breathingTip;
