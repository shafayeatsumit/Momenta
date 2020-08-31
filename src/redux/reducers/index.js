import {combineReducers} from 'redux';
import userInfo from './userInfo';
import onboarding from './onboarding';
import checkin from './checkin';
import breathing from './breathing';
import guidedBreathing from './guidedBreathing';
import fixedBreathing from './fixedBreathing';

export default combineReducers({
  userInfo,
  onboarding,
  checkin,
  breathing,
  guidedBreathing,
  fixedBreathing,
});
