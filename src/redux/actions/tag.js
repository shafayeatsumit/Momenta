import analytics from '@react-native-firebase/analytics';
import {api, imageDownloader} from '../../helpers/api';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

const TAG_COlORS = [
  ['#86B2FF', '#6852FD'],
  ['#3A89CD', '#3A53B5'],
  ['#3A89CD', '#3A53B5'],
  ['#A577F0', '#553CDC'],
  ['#E081D4', '#7241BF'],
  ['#86B2FF', '#6852FD'],
  ['#3EC0A6', '#0B6FA3'],
];

const downLoadImages = async (backgrounds, dispatch) => {
  backgrounds.map((imageObject) => {
    imageDownloader(imageObject.image)
      .then((response) => {
        const imageURI = {uri: `data:image/jpeg;base64,${response}`};
        dispatch({type: 'ADD_BACKGROUND', image: imageURI});
      })
      .catch((error) => console.log('error image download', error));
  });
};

export const toggleSelectedTag = (id) => (dispatch, getState) => {
  const {selectedTags} = getState();
  const isTagExist = selectedTags.includes(id);
  if (isTagExist) {
    dispatch({type: 'DESELECT_TAG', tagId: id});
    analytics().logEvent('deselect_tag', {tag_name: id});
  } else {
    dispatch({type: 'SELECT_TAG', tagId: id});
    analytics().logEvent('select_tag', {tag_name: id});
  }
};

const parseTags = (response) => {
  let tags = response.result;
  tags = tags.map((item) => ({...item, sets: item.sets.map((set) => set.id)}));
  tags = _.mapKeys(tags, 'id');
  return tags;
};

const parseSets = (response) => {
  let sets = response.result.map((tag) => tag.sets);
  sets = _.flatten(sets);
  sets = _.mapKeys(sets, 'id'); // group the sets in an object
  return sets;
};

export const fetchTags = () => (dispatch, getState) => {
  const url = 'tags/';
  api
    .get(url)
    .then((response) => {
      const backgrounds = response.data.images;
      const tags = parseTags(response.data);
      const tagNames = response.data.result.map((tag) => ({
        id: tag.id,
        name: tag.name,
        gradientColors: _.sample(TAG_COlORS),
      }));
      const sets = parseSets(response.data);
      dispatch({type: 'INITIAL_DATA', tags, tagNames, sets});
      downLoadImages(backgrounds, dispatch);
    })
    .catch((error) => {
      console.log('error in tags', error);
    });
};

export const anonymousSignup = () => (dispatch, getState) => {
  api
    .post('auth/anonymoussignup/')
    .then((resp) => {
      const {id} = resp.data;
      dispatch({type: 'UPDATE_TOKEN', data: resp.data});
      analytics().setUserId(id.toString());

      AsyncStorage.setItem('token', resp.data.token)
        .then(() => dispatch(fetchTags()))
        .catch((error) => console.log('error in setting async storage', error));
    })
    .catch((error) => console.log('error in auth==>', error));
};

export const deleteSet = () => (dispatch, getState) => {
  const {onScreen, tags, sets} = getState();
  const currentTagObject = tags[onScreen.tagId];
  const currentTagSets = currentTagObject.sets;
  const updatedTagSets = currentTagSets.slice(1);
  const updatedTags = {
    ...tags,
    [onScreen.tagId]: {
      ...currentTagObject,
      sets: updatedTagSets,
    },
  };

  const updatedSets = Object.assign({}, sets);
  delete updatedSets[onScreen.setId];
  dispatch({type: 'UPDATE_CONTENT', tags: updatedTags, sets: updatedSets});
};

const addNewContent = (dispatch, getState, response, tagId) => {
  const {tags, sets} = getState();
  const newSet = response.result[0];
  delete newSet.tags;
  const newSetId = newSet.id;
  const currentTag = tags[tagId];
  const currentTagSets = [...currentTag.sets, newSetId];
  // updating the set of current tag.
  const updatedTags = {
    ...tags,
    [tagId]: {
      ...currentTag,
      sets: currentTagSets,
    },
  };
  // adding the new set.
  const updatedSets = {
    ...sets,
    [newSetId]: newSet,
  };
  dispatch({type: 'UPDATE_CONTENT', tags: updatedTags, sets: updatedSets});
};

export const fetchContent = (tag) => (dispatch, getState) => {
  const tagName = tag.name;
  const tagId = tag.id;
  const queryString = '?tags' + '=' + tagName.replace(/ /g, '%20');
  const contentUrl = 'contents/' + queryString;
  api
    .get(contentUrl)
    .then((response) => {
      const backgroundImage = [response.data.image];
      addNewContent(dispatch, getState, response.data, tagId);
      downLoadImages(backgroundImage, dispatch);
    })
    .catch((error) => console.log(`error in ${contentUrl}`, error));
};
