const INITIAL_STATE = {id: null, sets: []};
const breathingTip = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        ...action.breathingTip,
      };
    default:
      return state;
  }
};

export default breathingTip;
