import {api} from '../../helpers/api';
import {bookmarkParser} from '../../helpers/common';

export const fetchBookmark = () => (dispatch, getState) => {
  const url = 'api/bookmarks/';
  api
    .get(url)
    .then((resp) => {
      console.log('resp', resp.data);
      const bookmarks = bookmarkParser(resp.data);
      dispatch({type: 'FETCH_BOOKMARKS', bookmarks});
    })
    .catch((error) => console.log('error', error));
};
