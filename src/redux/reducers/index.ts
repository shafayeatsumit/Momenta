import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
import { fetchCompletedReducer } from "./fetchCompleted";
import { settingsReducer } from "./settings";
import { courseReducer } from './course';
import { guidedPracitceReducer } from "./guidedPractice";
import { contentSettingReducer } from "./contentSettings";
// Action types;
import { User } from "../actions/user";

import { Exercises } from "../actions/exercise";
import { FetchCompleted } from "../actions/fetchCompleted";
import { Settings } from "../actions/settings";
import { Courses } from "../actions/course";
import { GuidePractices } from "../actions/guidedPractice";
import { BackgroundMusic } from "../reducers/backgroundMusic";
import { ContentSettings } from "../actions/contentSettings";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusic[];
  exercise: Exercises | {};
  fetchCompleted: FetchCompleted;
  settings: Settings;
  course: Courses | {};
  guidedPracitce: GuidePractices | {};
  contentSettings: ContentSettings | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
  fetchCompleted: fetchCompletedReducer,
  settings: settingsReducer,
  course: courseReducer,
  contentSettings: contentSettingReducer,
  guidedPracitce: guidedPracitceReducer,
});
