import { ActionTypes, ExerciseAction } from "../actions";
import { Exercises, ExerciseFetchCompleted } from "../actions/exercise";

const initialState = {
  fetchCompleted: false,
}

export const exerciseReducer = (state: Exercises | ExerciseFetchCompleted = initialState, action: ExerciseAction) => {
  switch (action.type) {
    case ActionTypes.AddExercise:
      return {
        ...state,
        ...action.payload,
        fetchCompleted: true,
      }
    default:
      return state;
  }
}