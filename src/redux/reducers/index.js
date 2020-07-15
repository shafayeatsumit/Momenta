import {combineReducers} from 'redux';
import userInfo from './userInfo';
import onboarding from './onboarding';
import {tagNames, tags} from './tags';
import sets from './sets';
import settings from './settings';
import currentSession from './currentSession';
import backgrounds from './backgrounds';
import breathing from './breathing';

export default combineReducers({
  userInfo,
  onboarding,
  tagNames,
  tags,
  sets,
  backgrounds,
  settings,
  currentSession,
  breathing,
});
