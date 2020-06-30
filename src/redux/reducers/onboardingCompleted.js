const onboardingCompleted = (state = false, action) => {
  switch (action.type) {
    case 'ONBOARDING_COMPLETED':
      return true;
    default:
      return state;
  }
};

export default onboardingCompleted;
