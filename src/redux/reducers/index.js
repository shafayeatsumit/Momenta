import {combineReducers} from 'redux';
import userInfo from './userInfo';
import firstLaunch from './firstLaunch';
import {tagNames, tags} from './tags';
import sets from './sets';
import settings from './settings';
import backgrounds from './backgrounds';

export default combineReducers({
  userInfo,
  firstLaunch,
  tagNames,
  tags,
  sets,
  backgrounds,
  settings,
});
