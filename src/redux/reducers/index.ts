import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
import { fetchCompletedReducer } from "./fetchCompleted";
import { settingsReducer } from "./settings";
import { courseReducer } from './course';

// Action types;
import { User } from "../actions/user";
import { BackgroundMusics } from "../actions/backgroundMusic";
import { Exercises } from "../actions/exercise";
import { FetchCompleted } from "../actions/fetchCompleted";
import { Settings } from "../actions/settings";
import { Courses } from "../actions/course";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusics | {};
  exercise: Exercises | {};
  fetchCompleted: FetchCompleted;
  settings: Settings;
  course: Courses | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
  fetchCompleted: fetchCompletedReducer,
  settings: settingsReducer,
  course: courseReducer,
});
