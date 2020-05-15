import {api} from '../../helpers/api';
import analytics from '@react-native-firebase/analytics';
import _ from 'lodash';

const addABookmark = (activeSet, dispatch, allContents) => {
  analytics().logEvent('bookmark_added', {set_id: activeSet});
  const url = 'api/bookmarks/';
  const bookmarkedSet = allContents
    .filter((item) => item.set === activeSet)
    .map((itemSet) => ({
      ...itemSet,
      isBookmark: true,
      setId: `${itemSet.tag}_${itemSet.set}`,
    }));
  dispatch({type: 'ADD_BOOKMARK', set: activeSet, bookmarkedSet});
  api
    .post(url, {set_id: activeSet})
    .then((resp) => {})
    .catch((error) => console.log('error', error));
};

const deleteBookmark = (activeSet, dispatch, activeTag) => {
  analytics().logEvent('bookmark_deleted', {set_id: activeSet});
  const url = `api/bookmarks/${activeSet}/`;
  const bookmarkSetId = `${activeTag}_${activeTag}`;
  dispatch({type: 'DELETE_BOOKMARK', set: activeSet, setId: bookmarkSetId});
  api
    .delete(url)
    .then((resp) => {
      console.log('delete bookmark', resp.data);
    })
    .catch((error) => console.log('error', error));
};

export const rejectSet = () => (dispatch, getState) => {
  const {contents} = getState();
  const {activeIndex, allContents} = contents;
  const activeSet = allContents[activeIndex].set;
  analytics().logEvent('reject_set', {set_id: activeSet});
  const url = `api/rejected_sets/${activeSet}/`;
  api
    .put(url)
    .then((resp) => {
      console.log('reject set', resp.data);
    })
    .catch((error) => console.log('error', error));
};

export const bookmarkSet = () => (dispatch, getState) => {
  const {contents} = getState();
  const {activeIndex, allContents} = contents;
  const activeContent = allContents[activeIndex];
  if (!activeContent) {
    return;
  }
  const activeSet = activeContent.set;
  const activeTag = activeContent.tag;
  const isBookmarked = activeContent.isBookmark;
  if (isBookmarked) {
    deleteBookmark(activeSet, dispatch, activeTag);
  } else {
    addABookmark(activeSet, dispatch, allContents);
  }
};
