import {bookmarks as defaultBookmarks} from '../../helpers/constants/tempdata';
import {shuffleArray, findNextSetIndex} from './helpers';

const INIT_STATE = {
  bookmarks: [],
  contents: [],
  activeIndex: null,
  shuffle: false,
};

const bookmarks = (state = INIT_STATE, action) => {
  let updatedIndex;
  switch (action.type) {
    case 'FETCH_BOOKMARKS':
      return {
        ...state,
        bookmarks: defaultBookmarks,
        contents: defaultBookmarks,
      };
    case 'START_BOOKMARKS':
      return {
        ...state,
        activeIndex: 0,
      };
    case 'NEXT_BOOKMARK_CONTENT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex + 1;
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'PREVIOUS_BOOKMARK_CONTENT':
      updatedIndex = state.activeIndex ? state.activeIndex - 1 : 0;
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'GO_TO_NEXT_BOOKMARK_SET':
      const nextIndex = findNextSetIndex(state.activeIndex, state.contents);
      return {
        ...state,
        activeIndex: nextIndex,
      };
    case 'BOOKMARK_SHUFFLE_OFF':
      return {
        ...state,
        contents: state.bookmarks,
        shuffle: false,
      };
    case 'BOOKMARK_SHUFFLE_ON':
      return {
        ...state,
        contents: shuffleArray(state.bookmarks.slice()),
        shuffle: true,
      };
    case 'ADD_NEW_BOOKMARK':
      return state;
    case 'CHANGE_BOOKMARK_ORDER':
      // using drag and drop they changed the order
      return state;
    default:
      return state;
  }
};

export default bookmarks;
