import { ActionTypes, GuidedPracticeSettingsAction } from "../actions";
import { GuidedPracticeSettings } from "../actions/guidedPracticeSettings";

const initialState = {}

export const guidedPracticeSettingReducer = (state: GuidedPracticeSettings = initialState, action: GuidedPracticeSettingsAction) => {
  switch (action.type) {
    case ActionTypes.ChangePracticeMusic:
      const { musicId } = action.payload;
      return {
        ...state,
        [action.payload.practiceId]: {
          ...state[action.payload.practiceId],
          backgroundMusic: musicId,
        }
      }
    case ActionTypes.UpdateLastPractice:
      const { trackId } = action.payload;
      return {
        ...state,
        [action.payload.practiceId]: {
          ...state[action.payload.practiceId],
          lastPlayed: trackId,
        }
      }
    default:
      return state;
  }
}
