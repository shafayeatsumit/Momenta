import {combineReducers} from 'redux';
import categories from './categories';
import contents from './contents';
export default combineReducers({
  categories,
  contents,
});
