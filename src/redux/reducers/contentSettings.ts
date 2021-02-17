import { ActionTypes, ContentSettingsAction } from "../actions";
import { ContentSettings } from "../actions/contentSettings"

const initialState = {}
export const contentSettingReducer = (state: ContentSettings | {} = initialState, action: ContentSettingsAction) => {
  switch (action.type) {
    case ActionTypes.UpdateContentSettings:
      const { lastLesson } = action.payload;
      return {
        ...state,
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          lastLesson,
        }
      }
    case ActionTypes.UpdateContentBackgroundMusic:
      const { backgroundMusic } = action.payload;
      return {
        ...state,
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          backgroundMusic,
        }
      }
    case ActionTypes.ContentFinished:
      return {
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          isFinished: true,
          lastLesson: 0,
        }
      }
    default:
      return state;
  }
}