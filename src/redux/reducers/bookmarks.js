import {bookmarks as defaultBookmarks} from '../../helpers/constants/tempdata';
import {shuffleArray, findNextSetIndex} from './helpers';
import {ActionSheetIOS} from 'react-native';

const INIT_STATE = {
  bookmarks: [],
  contents: [],
  activeIndex: null,
  shuffle: false,
};

const bookmarks = (state = INIT_STATE, action) => {
  let updatedIndex, updatedContents, activeSetId;
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
      updatedContents = state.contents.map((item) =>
        item.id === state.contents[state.activeIndex].id
          ? {...item, isSeen: true}
          : item,
      );
      return {
        ...state,
        activeIndex: updatedIndex,
        contents: updatedContents,
      };
    case 'ACTIVE_SET_MOVED_UP':
      return {
        ...state,
        activeIndex: action.updatedActiveIndex,
        bookmarks: action.bookmarks,
        contents: action.bookmarks,
      };
    case 'ACTIVE_SET_MOVED_DOWN':
      return {
        ...state,
        activeIndex: action.updatedActiveIndex,
        bookmarks: action.bookmarks,
        contents: action.bookmarks,
      };
    case 'PREVIOUS_BOOKMARK_CONTENT':
      updatedIndex = state.activeIndex ? state.activeIndex - 1 : 0;
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'GO_TO_NEXT_BOOKMARK_SET':
      const nextIndex = findNextSetIndex(state.activeIndex, state.contents);
      activeSetId = state.contents[state.activeIndex].setId;
      updatedContents = state.contents.map((item) =>
        item.setId === activeSetId ? {...item, isSeen: false} : item,
      );
      return {
        ...state,
        contents: updatedContents,
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
    case 'DELTE_BOOKMARK':
      updatedContents = state.contents.filter(
        (item) => item.setId !== action.setId,
      );
      return {
        ...state,
        bookmarks: updatedContents,
        contents: updatedContents,
      };
    case 'ADD_NEW_BOOKMARK':
      return state;
    case 'UPDATE_BOOKMARK_ORDER':
      // using drag and drop they changed the order
      return {
        ...state,
        bookmarks: action.bookmarks,
        contents: action.bookmarks,
      };
    case 'START_FROM_SPECIFIC_BOOKMARK_SET':
      updatedIndex = state.contents.findIndex(
        (item) => item.setId === action.selectedSetId,
      );
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'RESET_BOOKMARKS':
      updatedContents = state.contents.map((item) => ({
        ...item,
        isSeen: false,
      }));
      return {
        ...state,
        contents: updatedContents,
        bookmarks: updatedContents,
        activeIndex: null,
      };
    default:
      return state;
  }
};

export default bookmarks;
