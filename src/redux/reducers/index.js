import {combineReducers} from 'redux';
import loginInfo from './loginInfo';
import firstLaunch from './firstLaunch';
import {tagNames, tags} from './tags';
import sets from './sets';
import backgrounds from './backgrounds';

export default combineReducers({
  loginInfo,
  firstLaunch,
  tagNames,
  tags,
  sets,
  backgrounds,
});
