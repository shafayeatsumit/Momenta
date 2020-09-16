const initialState = {
  id: 'calm',
  numberOfBreaths: 2,
  targetInhale: 3.5,
  targetExhale: 3.5,
  firstThreshold: 120,
  secondThreshold: 0,
  secondTargetInhale: 0,
  secondTargetExhale: 0,
  breathingTime: 1,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_GUIDED_TYPE':
      return {
        ...state,
        ...action.data,
      };
    case 'UPDATE_CALIBRATION_TIME':
      return {
        ...state,
        calibrationExhale: action.calibrationExhale,
        calibrationInhale: action.calibrationInhale,
      };
    case 'SELECT_GUIDED_TIME':
      return {
        ...state,
        breathingTime: action.breathingTime,
      };
    default:
      return state;
  }
};

export default breathing;
