import {combineReducers} from 'redux';
import userInfo from './userInfo';
import onboarding from './onboarding';
import checkin from './checkin';
import courses from './courses';

export default combineReducers({
  userInfo,
  onboarding,
  checkin,
  courses,
});
