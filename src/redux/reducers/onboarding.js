const INIT_STATE = {
  completed: false, // 4 seconds.
  needSecondTry: false, // 4 seconds.
};

const onboarding = (state = INIT_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default onboarding;
