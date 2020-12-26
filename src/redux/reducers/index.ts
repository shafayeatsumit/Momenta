import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
// Action types;
import { User } from "../actions/user";
import { BackgroundMusics, BackgroundMusicFetchCompleted } from "../actions/backgroundMusic";
import { Exercises, ExerciseFetchCompleted } from "../actions/exercise";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusics | BackgroundMusicFetchCompleted;
  exercise: Exercises | ExerciseFetchCompleted;
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
});
