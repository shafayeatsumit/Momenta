const INIT_STATE = {
  token: null,
  isAnonymous: true,
  sessionCount: 0,
};

const loginInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
};

export default loginInfo;
