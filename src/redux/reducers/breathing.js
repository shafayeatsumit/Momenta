const initialState = {
  type: 'guided',
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'SWITCH_BREATHING_TYPE':
      return {
        ...state,
        type: state.type === 'guided' ? 'fixed' : 'guided',
      };

    default:
      return state;
  }
};

export default breathing;
