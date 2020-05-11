import {api} from '../../helpers/api';
import {bookmarkParser} from '../../helpers/common';
import analytics from '@react-native-firebase/analytics';

export const fetchBookmark = () => (dispatch, getState) => {
  const url = 'api/bookmarks/';
  api
    .get(url)
    .then((resp) => {
      const bookmarks = bookmarkParser(resp.data);
      dispatch({type: 'FETCH_BOOKMARKS', bookmarks});
    })
    .catch((error) => console.log('error', error));
};

export const deleteBookmark = (setId, bookmarkedItems) => (
  dispatch,
  getState,
) => {
  analytics().logEvent('bookmark_deleted', {set_id: setId});
  const url = `api/bookmarks/${setId}/`;
  const bookmarkSet = bookmarkedItems[0].set;
  dispatch({type: 'DELETE_BOOKMARK', set: bookmarkSet, setId});
  api
    .delete(url)
    .then((resp) => {
      console.log('delete bookmark', resp.data);
    })
    .catch((error) => console.log('error', error));
};
