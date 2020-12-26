import { ActionTypes, BackgroundMusicAction } from '../actions';
import { BackgroundMusics, BackgroundMusicFetchCompleted } from "../actions/backgroundMusic";

const initState = {
  fetchCompleted: false,
}

export const backgroundMusicReducer = (state: BackgroundMusics | BackgroundMusicFetchCompleted = initState, action: BackgroundMusicAction) => {
  switch (action.type) {
    case ActionTypes.AddBackgroundMusic:
      return {
        ...state,
        ...action.payload,
        fetchCompleted: true,
      }
    default:
      return state;
  }
};