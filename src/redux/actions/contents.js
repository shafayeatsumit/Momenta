import {api} from '../../helpers/api';
import analytics from '@react-native-firebase/analytics';

export const addContent = () => ({
  type: 'ADD_CONTENT',
});

export const nextContent = () => ({
  type: 'NEXT_CONTENT',
});

export const previousContent = () => ({
  type: 'PREVIOUS_CONTENT',
});

export const goToNextSet = () => ({
  type: 'GO_TO_NEXT_SET',
});

const addABookmark = (activeSet, dispatch) => {
  analytics().logEvent('bookmark_added', {set_id: activeSet});
  const url = 'api/bookmarks/';
  api
    .post(url, {set_id: activeSet})
    .then((resp) => {
      dispatch({type: 'ADD_BOOKMARK', set: activeSet});
    })
    .catch((error) => console.log('error', error));
};

const deleteBookmark = (activeSet, dispatch) => {
  analytics().logEvent('bookmark_deleted', {set_id: activeSet});
  const url = `api/bookmarks/${activeSet}`;
  api
    .delete(url)
    .then((resp) => {
      dispatch({type: 'DELETE_BOOKMARK', set: activeSet});
    })
    .catch((error) => console.log('error', error));
};

export const bookmarkSet = () => (dispatch, getState) => {
  const {contents} = getState();
  const {activeIndex, allContents} = contents;
  const activeSet = allContents[activeIndex].set;
  const isBookmarked = allContents[activeIndex].bookmark;
  if (isBookmarked) {
    deleteBookmark(activeSet, dispatch);
  } else {
    addABookmark(activeSet, dispatch);
  }
};
