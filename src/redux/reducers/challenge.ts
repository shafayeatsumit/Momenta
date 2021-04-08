import { ActionTypes, ChallengeAction } from "../actions";
import { Challenges } from "../actions/challenge";

const initialState = {}

export const challengeReducer = (state: Challenges | {} = initialState, action: ChallengeAction) => {
  switch (action.type) {
    case ActionTypes.AddChallenge:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}