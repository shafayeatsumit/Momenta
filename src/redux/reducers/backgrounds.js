const backgrounds = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BACKGROUND':
      return [...state, action.image];
    case 'REMOVE_BACKGROUND':
      return state.slice(1);
    default:
      return state;
  }
};

export default backgrounds;
