import {combineReducers} from 'redux';

import loginInfo from './loginInfo';
import minimized from './minimized';
import firstLaunch from './firstLaunch';
// new added
import {tagNames, tags, selectedTags} from './tags';
import sets from './sets';
import backgrounds from './backgrounds';
import onScreen from './onScreen';

export default combineReducers({
  loginInfo,
  minimized,
  firstLaunch,
  tagNames,
  tags,
  selectedTags,
  sets,
  backgrounds,
  onScreen,
});
