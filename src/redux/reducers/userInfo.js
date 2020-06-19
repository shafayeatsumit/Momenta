const INIT_STATE = {
  token: null,
  isAnonymousUser: true,
  email: null,
  userId: null,
  name: null,
  playCount: 1,
};

const loginInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER_DATA':
      const {token, isAnonymousUser, email, name, id: userId} = action.data;
      return {
        ...state,
        token,
        isAnonymousUser,
        email,
        name,
        userId,
      };
    case 'INCREASE_PLAY_COUNT':
      return {
        ...state,
        playCount: state.playCount + 1,
      };
    default:
      return state;
  }
};

export default loginInfo;
