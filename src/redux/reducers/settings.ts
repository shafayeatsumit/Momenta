import { ActionTypes, SettingsAction } from "../actions";
import { Settings } from "../actions/settings";

const initialState = {
  backgroundMusic: 'swell',
  vibrationType: 'purr_exhale',
}

export const settingsReducer = (state: Settings = initialState, action: SettingsAction) => {
  switch (action.type) {
    case ActionTypes.ChangeBackgroundMusic:
      return {
        ...state,
        backgroundMusic: action.payload,
      }
    case ActionTypes.ChangeVibrationType:
      return {
        ...state,
        vibrationType: action.payload,
      }
    default:
      return state;
  }
}