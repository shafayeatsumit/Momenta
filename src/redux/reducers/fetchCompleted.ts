import { ActionTypes, FetchCompletedAction } from "../actions";
import { FetchCompleted } from "../actions/fetchCompleted";

const initialState = {
  musicFetchCompleted: false,
  exerciseFetchCompleted: false,
}

export const fetchCompletedReducer = (state: FetchCompleted = initialState, action: FetchCompletedAction) => {
  console.log('action types', action.type)
  switch (action.type) {
    case ActionTypes.AddExercise:
      return {
        ...state,
        exerciseFetchCompleted: true,
      }
    case ActionTypes.AddBackgroundMusic:
      return {
        ...state,
        musicFetchCompleted: true,
      }
    default:
      return state;
  }
}