const INIT_STATE = {
  token: null,
  email: null,
  userId: null,
  name: null,
  soundOn: true,
  onboarded: false,
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
    case 'START_SOUND':
      return {
        ...state,
        soundOn: true,
      };
    case 'STOP_SOUND':
      return {
        ...state,
        soundOn: false,
      };
    case 'ONBOARDING_DONE':
      return {
        ...state,
        onboarded: true,
      };
    default:
      return state;
  }
};

export default loginInfo;
