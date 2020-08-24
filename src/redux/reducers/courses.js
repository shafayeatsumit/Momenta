const INIT_STATE = {
  type: 'calm',
  targetInhaleTime: 4,
  targetExhaleTime: 4,
  totalBreaths: 5,
};

const courses = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_COURSE':
      return {
        ...state,
        inhaleTime: action.inhaleTime,
        exhaleTime: action.exhaleTime,
        totalBreaths: action.totalBreaths,
      };
    default:
      return state;
  }
};

export default courses;
