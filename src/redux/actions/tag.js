import analytics from '@react-native-firebase/analytics';
import {api, imageDownloader} from '../../helpers/api';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

const TAG_COlORS = [
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
        dispatch({
          type: 'ADD_BACKGROUND',
          image: {uri: imageURI, id: imageObject.id},
        });
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
  let tags = response.map((item) => ({
    ...item,
    sets: item.sets.map((set) => set.id),
  }));

  tags = _.mapKeys(tags, 'id');
  return tags;
};

const parseSets = (response) => {
  let sets = response.map((tag) => tag.sets);
  sets = _.flatten(sets);
  sets = _.mapKeys(sets, 'id'); // group the sets in an object
  return sets;
};

const getTagNames = (response) => {
  return response.map((tag, index) => ({
    id: tag.id,
    name: tag.name,
    imageName: tag.name.toLowerCase().split(/\s/).join(''),
  }));
};

const parseBreathingTips = (tagsData) => {
  let breathingTips = tagsData.find((item) => item.name === 'Breathing Tips');
  breathingTips = breathingTips.sets.map((tip) => ({
    tip: tip.contents[0].text,
    id: tip.contents[0].id,
  }));
  return breathingTips;
};

const getNewBreathingTips = (prevBreathingTips, breathingTips) => {
  const prevTipsKeys = prevBreathingTips.map((item) => item.id);
  const newTips = breathingTips.filter(
    (tip) => prevTipsKeys.indexOf(tip.id) === -1,
  );
  return newTips;
};

export const fetchTags = (isNewUser) => (dispatch, getState) => {
  const {breathing} = getState();
  const url = 'tags/';
  api
    .get(url)
    .then((response) => {
      const backgrounds = response.data.images;
      const tagsData = response.data.result;
      const breathingTips = parseBreathingTips(tagsData);
      const newBreathingTips = getNewBreathingTips(
        breathing.breathingTips,
        breathingTips,
      );
      const tagsResponse = tagsData.filter(
        (item) => item.name !== 'Breathing Tips',
      );
      const tags = parseTags(tagsResponse);
      const sets = parseSets(tagsResponse);
      const tagNames = getTagNames(tagsResponse);

      dispatch({
        type: 'INITIAL_DATA',
        tags,
        tagNames,
        sets,
        breathingTips: newBreathingTips,
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

export const removeContent = (tagId) => (dispatch, getState) => {
  const {tags, sets} = getState();
  const currentTagObject = tags[tagId];
  const currentTagSets = currentTagObject.sets;
  const updatedTagSets = currentTagSets.slice(1);
  const firstStId = tags[tagId].sets[0];
  const updatedTags = {
    ...tags,
    [tagId]: {
      ...currentTagObject,
      sets: updatedTagSets,
    },
  };
  const updatedSets = Object.assign({}, sets);
  delete updatedSets[firstStId];
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
  const newSet = response;
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

export const removeBackground = () => (dispatch, getState) => {
  dispatch({type: 'REMOVE_BACKGROUND'});
  return Promise.resolve();
};

export const activateTag = (tagIndex) => (dispatch, getState) => {
  const {tagNames} = getState();
  const updatedTags = tagNames.map((tag, index) =>
    index === tagIndex ? {...tag, active: true} : {...tag, active: false},
  );
  dispatch({type: 'UPDATE_ACTIVE_TAG', tags: updatedTags});
};

export const handleTagSelect = (tagId) => (dispatch, getState) => {
  const {settings} = getState();
  const {selectedTags} = settings;
  const isSelected = selectedTags.includes(tagId);
  if (isSelected) {
    const updatedTags = selectedTags.filter((id) => id !== tagId);
    dispatch({type: 'UPDATE_SELECTED_TAGS', selectedTags: updatedTags});
    analytics().logEvent('deselect_tag', {tag_id: tagId});
  } else {
    const updatedTags = [tagId];
    dispatch({type: 'UPDATE_SELECTED_TAGS', selectedTags: updatedTags});
    analytics().logEvent('select_tag', {tag_id: tagId});
  }
};
