import { ActionTypes, ExerciseSettingsAction } from "../actions";
import { ExerciseSettings } from "../actions/exerciseSettings"

const initialState = {}


export const exerciseSettingReducer = (state: ExerciseSettings = initialState, action: ExerciseSettingsAction) => {
  switch (action.type) {
    case ActionTypes.ChangeExerciseMusic:
      const { musicId } = action.payload;
      return {
        ...state,
        [action.payload.exerciseId]: {
          ...state[action.payload.exerciseId],
          backgroundMusic: musicId,
        }
      }
    default:
      return state;

  }
}