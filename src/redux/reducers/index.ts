import { combineReducers } from 'redux';
import { userReducer } from "./user";
import { User } from "../actions/user";
import { countReducer } from "./count";

export interface AppState {
  users: User[];
  count: number;
}

export const rootReducers = combineReducers<AppState>({
  users: userReducer,
  count: countReducer,
});
