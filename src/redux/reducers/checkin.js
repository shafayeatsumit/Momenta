const INIT_STATE = {
  inhaleTime: 0,
  exhaleTime: 0,
};

const checkin = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_CHECKIN_TIME':
      return {
        ...state,
        inhaleTime: action.inhaleTime,
        exhaleTime: action.exhaleTime,
      };
    default:
      return state;
  }
};

export default checkin;
