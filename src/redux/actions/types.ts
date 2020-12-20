import { FetchUsersAction, DeleteUserAction } from './user';
import { AddCountAction, RemoveCountAction } from "./count";

export enum ActionTypes {
  fetchUsers,
  deleteUser,
  addCount = "ADD_COUNT",
  removeCount = "REMOVE_COUNT",
}

export type UserAction = FetchUsersAction | DeleteUserAction;
export type CountAction = AddCountAction | RemoveCountAction;

