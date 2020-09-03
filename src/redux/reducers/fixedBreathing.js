import {fixedBreathingProperties} from '../../helpers/constants';

const initialState = {
  id: 'beginner_box',
  numberOfBreaths: 10,
  name: 'Beginner Box',
  inhale: 2,
  inhaleHold: 2,
  exhale: 2,
  exhaleHold: 2,
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SWITCH_FIXED_BREATHING_TYPE':
      return {
        ...state,
        ...fixedBreathingProperties[action.breathingType],
      };

    case 'ADD_FIXED_INHALE':
      return {
        ...state,
        inhale: state.inhale + 1,
      };
    case 'REMOVE_FIXED_INHALE':
      return {
        ...state,
        inhale: state.inhale > 2 ? state.inhale - 1 : state.inhale,
      };

    case 'ADD_FIXED_EXHALE':
      return {
        ...state,
        exhale: state.exhale + 1,
      };

    case 'REMOVE_FIXED_EXHALE':
      return {
        ...state,
        exhale: state.exhale > 2 ? state.exhale - 1 : state.exhale,
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
          state.inhaleHold > 0 ? state.inhaleHold - 1 : state.inhaleHold,
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
          state.exhaleHold > 0 ? state.exhaleHold - 1 : state.exhaleHold,
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
          state.numberOfBreaths > 1
            ? state.numberOfBreaths - 1
            : state.numberOfBreaths,
      };
    default:
      return state;
  }
};

export default breathing;
