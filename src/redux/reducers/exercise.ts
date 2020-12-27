import { ActionTypes, ExerciseAction } from "../actions";
import { Exercises } from "../actions/exercise";

const initialState = {}


export const exerciseReducer = (state: Exercises | {} = initialState, action: ExerciseAction) => {
  switch (action.type) {
    case ActionTypes.AddExercise:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}