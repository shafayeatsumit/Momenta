const sets = (state = {}, action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        ...action.sets,
      };

    default:
      return state;
  }
};

export default sets;
