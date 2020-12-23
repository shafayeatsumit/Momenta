import { User, UserAction, ActionTypes } from '../actions';

const initState = {}

export const userReducer = (state: User | {} = initState, action: UserAction) => {
  switch (action.type) {
    case ActionTypes.SignUpAnonymously:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
};