const multiselect = (state = false, action) => {
  switch (action.type) {
    case 'MULTI_SELECT_MODE':
      return true;
    default:
      return state;
  }
};

export default multiselect;
