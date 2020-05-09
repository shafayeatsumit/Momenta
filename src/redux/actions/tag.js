import analytics from '@react-native-firebase/analytics';
export const toggleSelectedTag = (id) => (dispatch, getState) => {
  const {categories} = getState();
  const {multiselectMode, selected} = categories;
  if (multiselectMode) {
    const isTagExist = categories.selected.includes(id);
    isTagExist
      ? analytics().logEvent('deselect_tag', {tag_name: id})
      : analytics().logEvent('select_tag', {tag_name: id});

    const selectedTags = isTagExist
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    dispatch({
      type: 'TOOGLE_SELECTED_TAG',
      selectedTags,
    });
  } else {
    //single category selected
    analytics().logEvent('select_tag', {tag_name: id});
    dispatch({
      type: 'CHOOSE_SINGLE_TAG',
      id,
    });
  }
};
