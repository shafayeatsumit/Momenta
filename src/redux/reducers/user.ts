import { User, UserAction, ActionTypes } from '../actions';

export const userReducer = (state: User[] = [], action: UserAction) => {
  switch (action.type) {
    case ActionTypes.fetchUsers:
      return action.payload;
    default:
      return state;
  }
};