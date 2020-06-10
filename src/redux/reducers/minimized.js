const minimized = (state = false, action) => {
  switch (action.type) {
    case 'SET_MINIMIZE_TRUE':
      return true;
    case 'RESET_CONTENT':
      return false;
    default:
      return state;
  }
};

export default minimized;
