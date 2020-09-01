import {guidedBreathingProperties} from '../../helpers/constants';

const initialState = {
  id: 'calm',
  numberOfBreaths: 10,
  targetInhale: 4,
  targetExhale: 4,
  multiLevel: false,
  calibrationInhale: 0,
  calibrationExhale: 0,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SWITCH_GUIDED_BREATHING_TYPE':
      return {
        ...state,
        ...guidedBreathingProperties[action.breathingType],
      };
    case 'UPDATE_CALIBRATION_TIME':
      return {
        ...state,
        calibrationInhale: action.calibrationInhale,
        calibrationExhale: action.calibrationExhale,
      };
    case 'ADD_GUIDED_BREATH':
      return {
        ...state,
        numberOfBreaths: state.numberOfBreaths + 1,
      };
    case 'REMOVE_GUIDED_BREATH':
      return {
        ...state,
        numberOfBreaths:
          state.numberOfBreaths > 5
            ? state.numberOfBreaths - 1
            : state.numberOfBreaths,
      };
    default:
      return state;
  }
};

export default breathing;
