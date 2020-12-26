import { ActionTypes, ExerciseAction } from "../actions";
import { Exercises } from "../actions/exercise";

const initialState = {
  fetchingExercise: true,
}

export const exerciseReducer = (state: Exercises | {} = initialState, action: ExerciseAction) => {
  switch (action.type) {
    case ActionTypes.AddExercise:
      return {
        ...state,
        ...action.payload,
        fetchingExercise: false,
      }
    default:
      return state;
  }
}