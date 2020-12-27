import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
import { fetchCompletedReducer } from "./fetchCompleted";
// Action types;
import { User } from "../actions/user";
import { BackgroundMusics } from "../actions/backgroundMusic";
import { Exercises } from "../actions/exercise";
import { FetchCompleted } from "../actions/fetchCompleted";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusics | {};
  exercise: Exercises | {};
  fetchCompleted: FetchCompleted;
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
  fetchCompleted: fetchCompletedReducer,
});
