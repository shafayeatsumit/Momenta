import { ActionTypes, CountAction } from "../actions";

export const countReducer = (state: number = 0, action: CountAction) => {
  switch (action.type) {
    case ActionTypes.addCount:
      return state + action.payload;
    case ActionTypes.removeCount:
      return state - action.payload;
    default:
      return state;
  }
}