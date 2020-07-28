export const onboardingFinished = () => (dispatch) => {
  dispatch({ type: 'ONBOARDING_COMPLETED'});
  return Promise.resolve();  
};