import { ActionTypes, BackgroundMusicAction } from '../actions';
import { BackgroundMusics } from "../actions/backgroundMusic";

const initState = {}

export const backgroundMusicReducer = (state: BackgroundMusics | {} = initState, action: BackgroundMusicAction) => {
  switch (action.type) {
    case ActionTypes.AddBackgroundMusic:
      return {
        ...state,
        ...action.payload,

      }
    default:
      return state;
  }
};