const initialState = {
  id: 'calm',
  name: 'Calm',
  type: 'guided',
  dynamicTarget: true,
  targetInhale: 0,
  targetExhale: 0,
  firstThreshold: 60,
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
    case 'SET_DYNAMIC_TARGET':
      return {
        ...state,
        targetInhale: action.targetInhale,
        targetExhale: action.targetExhale,
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
