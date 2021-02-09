import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
import { fetchCompletedReducer } from "./fetchCompleted";
import { settingsReducer } from "./settings";
import { courseReducer } from './course';
import { userStatsReducer } from "./userStats";
// Action types;
import { User } from "../actions/user";

import { Exercises } from "../actions/exercise";
import { FetchCompleted } from "../actions/fetchCompleted";
import { Settings } from "../actions/settings";
import { Courses } from "../actions/course";
import { BackgroundMusic } from "../reducers/backgroundMusic";
import { UserStats } from "../actions/userStats";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusic[];
  exercise: Exercises | {};
  fetchCompleted: FetchCompleted;
  settings: Settings;
  course: Courses | {};
  userStats: UserStats | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
  fetchCompleted: fetchCompletedReducer,
  settings: settingsReducer,
  course: courseReducer,
  userStats: userStatsReducer,
});
