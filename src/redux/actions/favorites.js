import {api} from '../../helpers/api';
import analytics from '@react-native-firebase/analytics';
import {Alert} from 'react-native';

const addFavorite = (setId) => {
  analytics().logEvent('bookmark_added', {set_id: setId});
  const url = 'bookmarks/';
  api
    .post(url, {set_id: setId})
    .then((resp) => {
      console.log('adding bookmark', resp.data);
    })
    .catch((error) => console.log('error add favorite', error));
};

const deleteFavorite = (setId) => {
  analytics().logEvent('bookmark_deleted', {set_id: setId});
  const url = `bookmarks/${setId}/`;

  api
    .delete(url)
    .then((resp) => {
      console.log('delete bookmark', resp.data);
    })
    .catch((error) => console.log('error delete favorite', error));
};

export const handleFavorite = (setId) => (dispatch, getState) => {
  const {tags, sets} = getState();
  const favoriteTagId = Object.values(tags).find(
    (tag) => tag.name === 'Favorites',
  ).id;
  const favoriteTag = tags[favoriteTagId];
  const favoriteSets = favoriteTag.length;
  if (favoriteSets === 8) {
    return Alert.alert('Opps', 'You can only save 8 favorites for now.');
  }
  const isSetFavorite = favoriteTag.sets.includes(setId);
  if (isSetFavorite) {
    // remove from favorite
    const updatedTags = {
      ...tags,
      [favoriteTagId]: {
        ...favoriteTag,
        sets: favoriteTag.sets.filter((tag) => tag !== setId),
      },
    };
    const updatedSets = {
      ...sets,
      [setId]: {
        ...sets[setId],
        isBookmark: false,
      },
    };
    dispatch({type: 'UPDATE_CONTENT', tags: updatedTags, sets: updatedSets});
    deleteFavorite(setId);
  } else {
    // add to favorite
    const updatedTags = {
      ...tags,
      [favoriteTagId]: {
        ...favoriteTag,
        sets: [...favoriteTag.sets, setId],
      },
    };
    // find the set and bookmark it to true
    const updatedSets = {
      ...sets,
      [setId]: {
        ...sets[setId],
        isBookmark: true,
      },
    };
    dispatch({type: 'UPDATE_CONTENT', tags: updatedTags, sets: updatedSets});
    addFavorite(setId);
  }
};
