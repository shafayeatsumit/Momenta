import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
import { exerciseReducer } from "./exercise";
// Action types;
import { User } from "../actions/user";
import { BackgroundMusic } from "../actions/backgroundMusic";
import { Exercises } from "../actions/exercise";

export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusic | {};
  exercise: Exercises | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
  exercise: exerciseReducer,
});
