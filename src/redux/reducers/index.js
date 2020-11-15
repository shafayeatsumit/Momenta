import {combineReducers} from 'redux';
import userInfo from './userInfo';
import breathing from './breathing';
import guidedBreathing from './guidedBreathing';
import fixedBreathing from './fixedBreathing';

export default combineReducers({
  userInfo,
  breathing,
  guidedBreathing,
  fixedBreathing,
  // RIP: this later. these were whitelisted before.
  // settings: (state = {}) => state,
  // onboarding: (state = {}) => state,
});
