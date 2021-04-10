import { ActionTypes, ChallengeSettingsAction } from "../actions";
import { ChallengeSettings } from "../actions/challengeSettings"
import moment from 'moment';

const initialState = {}

export const challengeSettingReducer = (state: ChallengeSettings = initialState, action: ChallengeSettingsAction) => {
  switch (action.type) {
    case ActionTypes.ChangeChallengeBackground:
      const { backgroundMusic } = action.payload;
      return {
        ...state,
        [action.payload.challengeId]: {
          ...state[action.payload.challengeId],
          backgroundMusic,
        }
      }
    case ActionTypes.FinishedChallengeLesson:
      const { lessonId } = action.payload;
      return {
        ...state,
        [action.payload.challengeId]: {
          ...state[action.payload.challengeId],
          [lessonId]: {
            finished: true,
            finishedAt: moment(),
          },
        }
      }

    default:
      return state;
  }
}

