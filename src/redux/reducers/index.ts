import { combineReducers } from 'redux';
import { userReducer } from "./user";
import { User } from "../actions/user";
import { countReducer } from "./count";

export interface RootState {
  user: User | {};
}

export const rootReducers = combineReducers<RootState>({
  user: userReducer,
});
