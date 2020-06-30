import {combineReducers} from 'redux';
import userInfo from './userInfo';
import onboardingCompleted from './onboardingCompleted';
import {tagNames, tags} from './tags';
import sets from './sets';
import settings from './settings';
import currentSession from './currentSession';
import backgrounds from './backgrounds';
import breathingTip from './breathingTip';

export default combineReducers({
  userInfo,
  onboardingCompleted,
  tagNames,
  tags,
  sets,
  backgrounds,
  settings,
  breathingTip,
  currentSession,
});
