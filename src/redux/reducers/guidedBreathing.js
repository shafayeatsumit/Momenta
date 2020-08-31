const GuidedBreathing = {
  calm: {
    id: 'calm',
    numberOfBreaths: 10,
    targetInhale: 4,
    targetExhale: 4,
    multiLevel: false,
  },
  deep_calm: {
    id: 'deep_calm',
    targetInhale: 5,
    targetExhale: 5,
    multiLevel: false,
    numberOfBreaths: 25,
  },
  prepare_for_sleep: {
    id: 'prepare_for_sleep',
    targetInhale: 3,
    targetExhale: 7,
    multiLevel: false,
    numberOfBreaths: 25,
  },
  inner_quiet: {
    id: 'inner_quiet',
    targetInhale: 3,
    targetExhale: 6,
    multiLevel: true,
    numberOfBreaths: 25,
    targetInhaleNext: 4,
    targetExhaleNext: 4,
  },
};

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
        ...GuidedBreathing[action.breathingType],
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
