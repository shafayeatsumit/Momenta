const initialState = {
  numberOfBreaths: 10,
  inhale: 4,
  inhaleHold: 3,
  exhale: 4,
  exhaleHold: 3,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_FIXED_INHALE':
      return {
        ...state,
        inhale: state.inhale + 1,
      };
    case 'REMOVE_FIXED_INHALE':
      return {
        ...state,
        inhale: state.inhale > 3 ? state.inhale - 1 : state.inhale,
      };

    case 'ADD_FIXED_EXHALE':
      return {
        ...state,
        exhale: state.exhale + 1,
      };

    case 'REMOVE_FIXED_EXHALE':
      return {
        ...state,
        exhale: state.exhale > 3 ? state.exhale - 1 : state.exhale,
      };

    case 'ADD_FIXED_INHALE_HOLD':
      return {
        ...state,
        inhaleHold: state.inhaleHold + 1,
      };

    case 'REMOVE_FIXED_INHALE_HOLD':
      return {
        ...state,
        inhaleHold:
          state.inhaleHold > 1 ? state.inhaleHold - 1 : state.inhaleHold,
      };

    case 'ADD_FIXED_EXHALE_HOLD':
      return {
        ...state,
        exhaleHold: state.exhaleHold + 1,
      };

    case 'REMOVE_FIXED_EXHALE_HOLD':
      return {
        ...state,
        exhaleHold:
          state.exhaleHold > 1 ? state.exhaleHold - 1 : state.exhaleHold,
      };

    case 'ADD_FIXED_BREATH':
      return {
        ...state,
        numberOfBreaths: state.numberOfBreaths + 1,
      };
    case 'REMOVE_FIXED_BREATH':
      return {
        ...state,
        numberOfBreaths:
          state.numberOfBreaths > 10
            ? state.numberOfBreaths - 1
            : state.numberOfBreaths,
      };
    default:
      return state;
  }
};

export default breathing;
