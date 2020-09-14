const initialState = {
  id: 'beginner_box',
  breathingTime: 1,
  name: 'Beginner Box',
  inhale: 2,
  inhaleHold: 2,
  exhale: 2,
  exhaleHold: 2,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_FIXED_TYPE':
      return {
        ...state,
        ...action.data,
      };
    case 'SELECT_FIXED_TIME':
      return {
        ...state,
        breathingTime: action.breathingTime,
      };
    case 'SELECT_CUSTOM_TIME':
      return {
        ...state,
        [action.customType]: action.customTime,
      };
    default:
      return state;
  }
};

export default breathing;
