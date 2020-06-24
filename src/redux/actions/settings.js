export const toggleBreathingTips = (isBreathingTipsOn, breathingTipsId) => (
  dispatch,
  getState,
) => {
  const {settings} = getState();
  const {selectedTags} = settings;
  if (isBreathingTipsOn) {
    const updatedTags = selectedTags.filter(
      (tagId) => tagId !== breathingTipsId,
    );
    dispatch({type: 'UPDATE_SELECTED_TAGS', selectedTags: updatedTags});
  } else {
    const updatedTags = [...selectedTags, breathingTipsId];
    dispatch({type: 'UPDATE_SELECTED_TAGS', selectedTags: updatedTags});
  }
};
