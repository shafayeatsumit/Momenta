import analytics from '@react-native-firebase/analytics';
import {api, imageDownloader} from '../../helpers/api';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

const TAG_COlORS = [
  ['rgb(134,178,255)', 'rgb(104,82,253)'],
  ['rgb(134,178,255)', 'rgb(104,82,253)'],
  ['rgb(224,129,212)', 'rgb(114,65,191)'],
  ['rgb(246,162,124)', 'rgb(219,52,137)'],
  ['rgb(58,137,205)', 'rgb(58,83,181)'],
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

export const fetchTags = (newUser) => (dispatch, getState) => {
  const {settings} = getState();
  const url = 'tags/';
  api
    .get(url)
    .then((response) => {
      const backgrounds = response.data.images;
      const tags = parseTags(response.data);
      const tagNames = response.data.result.map((tag, index) => ({
        id: tag.id,
        name: tag.name,
        gradientColors: TAG_COlORS[index],
      }));
      const selectedTags = newUser
        ? tagNames
            .filter((tag) => tag.name !== 'Breathing Tip')
            .map((tag) => tag.id)
        : settings.selectedTags;
      console.log(`newuser ${newUser} selected tags ${selectedTags}`);
      const sets = parseSets(response.data);
      dispatch({
        type: 'INITIAL_DATA',
        tags,
        tagNames,
        sets,
        selectedTags,
      });
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
      dispatch({type: 'ADD_USER_DATA', data: resp.data});
      analytics().setUserId(id.toString());

      AsyncStorage.setItem('token', resp.data.token)
        .then(() => dispatch(fetchTags(true)))
        .catch((error) => console.log('error in setting async storage', error));
    })
    .catch((error) => console.log('error in auth==>', error));
};

export const removeContent = (tagId, setId, favoritesTagId) => (
  dispatch,
  getState,
) => {
  const {tags, sets} = getState();
  const currentTagObject = tags[tagId];
  const currentTagSets = currentTagObject.sets;
  const updatedTagSets = currentTagSets.slice(1);
  const favoritesSets = tags[favoritesTagId].sets;
  const updatedTags = {
    ...tags,
    [tagId]: {
      ...currentTagObject,
      sets: updatedTagSets,
    },
  };
  const updatedSets = Object.assign({}, sets);
  const notFavoriteSet = !favoritesSets.includes(setId);
  if (notFavoriteSet) {
    delete updatedSets[setId];
  }
  dispatch({type: 'UPDATE_CONTENT', tags: updatedTags, sets: updatedSets});
};

export const moveFirstSetToLast = (tagId) => (dispatch, getState) => {
  const {tags} = getState();
  const sets = tags[tagId].sets;
  const firstSet = sets[0]; // removed the first element
  const updatedSets = sets.slice(1);
  const updatedFavoriteSets = [...updatedSets, firstSet];
  const updatedTags = {
    ...tags,
    [tagId]: {
      ...tags[tagId],
      sets: updatedFavoriteSets,
    },
  };
  dispatch({type: 'MOVE_FIRST_SET_TO_LAST', tags: updatedTags});
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

export const fetchContent = (tagId) => (dispatch, getState) => {
  const {tags} = getState();
  const tagName = tags[tagId].name;
  const queryString = '?tags' + '=' + tagName.replace(/ /g, '%20');
  const contentUrl = 'contents/' + queryString;
  api
    .get(contentUrl)
    .then((response) => addNewContent(dispatch, getState, response.data, tagId))
    .catch((error) => console.log(`error in ${contentUrl}`, error));
};

export const fetchBackground = () => (dispatch, getState) => {
  const url = 'background_image/';
  api
    .get(url)
    .then((response) => {
      const backgroundImage = [response.data];
      downLoadImages(backgroundImage, dispatch);
    })
    .catch((error) => console.log(`error in ${url}`, error));
};

export const activateTag = (tagIndex) => (dispatch, getState) => {
  const {tagNames} = getState();
  const updatedTags = tagNames.map((tag, index) =>
    index === tagIndex ? {...tag, active: true} : {...tag, active: false},
  );
  dispatch({type: 'UPDATE_ACTIVE_TAG', tags: updatedTags});
};
