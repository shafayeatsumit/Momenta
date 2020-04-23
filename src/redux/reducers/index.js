import {combineReducers} from 'redux';
import categories from './categories';
import contents from './contents';
import bookmarks from './bookmarks';
import contentType from './contentType';

const minimized = (state = false, action) => {
  switch (action.type) {
    case 'SET_MINIMIZE_TRUE':
      return true;
    case 'RESET_CATEGORIES_CONTENT':
    case 'SET_CONTENT_TYPE':
    case 'RESET_BOOKMARKS':
    case 'SET_MINIMIZE_FALSE':
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  categories,
  contents,
  bookmarks,
  minimized,
  contentType, // (bookmarks, regular)
});
