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
    case ActionTypes.ChangeExerciseRhythm:
      const { rhythm } = action.payload;
      return {
        [action.payload.exerciseId]: {
          ...state[action.payload.exerciseId],
          rhythm,
        }
      }
    case ActionTypes.ChangeVibrationType:
      const { vibrationType } = action.payload;
      return {
        [action.payload.exerciseId]: {
          ...state[action.payload.exerciseId],
          vibrationType,
        }
      }
    default:
      return state;

  }
}