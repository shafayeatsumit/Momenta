const INIT_STATE = {
  token: null,
  email: null,
  userId: null,
  name: null,
  musicOn: true,
};

const loginInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER_DATA':
      const {token, email, name, id: userId} = action.data;
      return {
        ...state,
        token,
        email,
        name,
        userId,
      };
    case 'TOGGLE_MUSIC':
      return {
        ...state,
        musicOn: !state.musicOn,
      };
    default:
      return state;
  }
};

export default loginInfo;
