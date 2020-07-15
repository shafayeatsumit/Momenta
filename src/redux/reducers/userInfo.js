const INIT_STATE = {
  token: null,
  isAnonymousUser: true,
  email: null,
  userId: null,
  name: null,
  breathCount: 0,
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
    default:
      return state;
  }
};

export default loginInfo;
