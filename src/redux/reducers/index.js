import {combineReducers} from 'redux';
import categories from './categories';
import contents from './contents';
// import bookmarks from './bookmarks';
import contentType from './contentType';
import loginInfo from './loginInfo';
import minimized from './minimized';

export default combineReducers({
  loginInfo,
  categories,
  contents,
  // bookmarks,
  minimized,
  contentType, // (bookmarks, regular)
});
