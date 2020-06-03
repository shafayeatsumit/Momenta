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
  const {selected} = categories;
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
};

export const fetchTags = () => (dispatch, getState) => {
  const {categories} = getState();
  const currentTagIds = categories.items.map((tag) => tag.id);
  const url = '/api/tags/';
  api
    .get(url)
    .then((resp) => {
      let tags = resp.data.map((item) => ({
        ...item,
        gradientColors: _.sample(TAG_COlORS),
        selected: false,
      }));
      tags = tags.filter((tag) => !currentTagIds.includes(tag.id));
      dispatch({type: 'UPDATE_TAGS', tags});
    })
    .catch((error) => {
      // dispatch({ type: 'FETCHING_TAG_DONE', data: resp.data });
    });
};

export const anonymousSignup = () => (dispatch, getState) => {
  api
    .post('api/auth/anonymoussignup/')
    .then((resp) => {
      const {id} = resp.data;
      dispatch({type: 'UPDATE_TOKEN', data: resp.data});
      analytics().setUserId(id.toString());
    })
    .catch((error) => console.log('error', error));
};
