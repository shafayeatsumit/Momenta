import { ActionTypes, ContentSettingsAction } from "../actions";
import { ContentSettings } from "../actions/contentSettings"

const initialState = {}
export const contentSettingReducer = (state: ContentSettings | {} = initialState, action: ContentSettingsAction) => {
  switch (action.type) {
    case ActionTypes.UpdateContentSettings:
      const { lastLesson } = action.payload;
      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          lastLesson,
        }
      }
    case ActionTypes.UpdateContentBackgroundMusic:
      const { backgroundMusic } = action.payload;
      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          backgroundMusic,
        }
      }
    case ActionTypes.UpdateContentVibrationType:
      const { vibrationType } = action.payload;

      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          vibrationType,
        }
      }
    case ActionTypes.ListenedWelcomeLesson:
      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          listenedWelcome: true,
        }
      }
    case ActionTypes.ListenedIntroLesson:
      const { introLessonOrder } = action.payload;
      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          lastIntroLesson: introLessonOrder,
        }
      }

    case ActionTypes.ListenedLesson:
      const { lessonOrder } = action.payload;
      return {
        ...state,
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          lastLesson: lessonOrder,
        }
      }

    case ActionTypes.ContentFinished:
      return {
        [action.payload.contentId]: {
          ...state[action.payload.contentId],
          isFinished: true,
          lastLesson: 0,
        }
      }
    default:
      return state;
  }
}