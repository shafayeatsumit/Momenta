import { combineReducers } from 'redux';
// reducers;
import { userReducer } from "./user";
import { backgroundMusicReducer } from "./backgroundMusic";
// Action types;
import { User } from "../actions/user";
import { BackgroundMusic } from "../actions/backgroundMusic";


export interface RootState {
  user: User | {};
  backgroundMusic: BackgroundMusic | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
  backgroundMusic: backgroundMusicReducer,
});
