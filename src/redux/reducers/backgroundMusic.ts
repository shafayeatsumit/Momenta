import { ActionTypes, BackgroundMusicAction } from '../actions';
import { BackgroundMusic } from "../actions/backgroundMusic";
const initState = {}

export const backgroundMusicReducer = (state: BackgroundMusic | {} = initState, action: BackgroundMusicAction) => {
  switch (action.type) {
    case ActionTypes.AddBackgroundMusic:
      return {
        ...state,
        [action.payload._id]: action.payload,
      }
    default:
      return state;
  }
};