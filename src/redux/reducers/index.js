import {combineReducers} from 'redux';
import categories from './categories';
import contents from './contents';
import loginInfo from './loginInfo';
import minimized from './minimized';
import firstLaunch from './firstLaunch';

export default combineReducers({
  loginInfo,
  categories,
  contents,
  minimized,
  firstLaunch,
});
