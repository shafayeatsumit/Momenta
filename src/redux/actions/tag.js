import analytics from '@react-native-firebase/analytics';
import {api} from '../../helpers/api';
import _ from 'lodash';

const TAG_COlORS = [
  ['#86B2FF', '#6852FD'],
  ['#3A89CD', '#3A53B5'],
  ['#3A89CD', '#3A53B5'],
  ['#A577F0', '#553CDC'],
  ['#E081D4', '#7241BF'],
  ['#86B2FF', '#6852FD'],
  ['#3EC0A6', '#0B6FA3'],
];

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

export const fetchTags = () => (dispatch, getState) => {
  const url = '/api/tags/';
  api
    .get(url)
    .then((resp) => {
      const tags = resp.data.map((item) => ({
        ...item,
        gradientColors: _.sample(TAG_COlORS),
        selected: false,
      }));
      dispatch({type: 'UPDATE_TAGS', tags});
    })
    .catch((error) => {
      // dispatch({ type: 'FETCHING_TAG_DONE', data: resp.data });
    });
};
