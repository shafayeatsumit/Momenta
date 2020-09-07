import {guidedBreathingProperties} from '../../helpers/constants';

const initialState = {
  id: 'calm',
  numberOfBreaths: 2,
  minNumberOfBreaths: 2,
  targetInhale: 3.5,
  targetExhale: 3.5,
  firstThreshold: 120,
  secondThreshold: 0,
  secondTargetInhale: 0,
  secondTargetExhale: 0,
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
        calibrationExhale: action.calibrationExhale,
        calibrationInhale: action.calibrationInhale,
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
          state.numberOfBreaths > state.minNumberOfBreaths
            ? state.numberOfBreaths - 1
            : state.numberOfBreaths,
      };
    default:
      return state;
  }
};

export default breathing;
