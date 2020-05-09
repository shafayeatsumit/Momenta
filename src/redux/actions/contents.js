import {api} from '../../helpers/api';
import analytics from '@react-native-firebase/analytics';

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
  const url = `api/bookmarks/${activeSet}/`;
  api
    .delete(url)
    .then((resp) => {
      console.log('delete bookmark', resp.data);
      dispatch({type: 'DELETE_BOOKMARK', set: activeSet});
    })
    .catch((error) => console.log('error', error));
};

export const bookmarkSet = () => (dispatch, getState) => {
  const {contents} = getState();
  const {activeIndex, allContents} = contents;
  const activeSet = allContents[activeIndex].set;
  const isBookmarked = allContents[activeIndex].isBookmark;
  console.log('bookmark set', isBookmarked);
  if (isBookmarked) {
    deleteBookmark(activeSet, dispatch);
  } else {
    addABookmark(activeSet, dispatch);
  }
};
