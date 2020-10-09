const initialState = {
  id: 'calm',
  name: 'Calm',
  type: 'guided',
  breathingTime: 1,
  recommendedTime: 1,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_GUIDED_TYPE':
    case 'SELECT_FIXED_TYPE':
      const {
        id,
        name,
        type,
        breathingTime,
        recommendedTime,
        name_line_one,
        name_line_two,
        description,
      } = action.data;
      return {
        ...state,
        id,
        name,
        type,
        breathingTime,
        recommendedTime,
        name_line_one,
        name_line_two,
        description,
      };
    case 'SELECT_GUIDED_TIME':
    case 'SELECT_FIXED_TIME':
      return {
        ...state,
        breathingTime: action.breathingTime,
      };
    default:
      return state;
  }
};

export default breathing;
