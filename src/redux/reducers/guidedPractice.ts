import { ActionTypes, GuidedPracticeAction } from "../actions";
import { GuidePractices } from "../actions/guidedPractice";

const initialState = {}
export const guidedPracitceReducer = (state: GuidePractices | {} = initialState, action: GuidedPracticeAction) => {
  switch (action.type) {
    case ActionTypes.AddGuidedPractice:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}