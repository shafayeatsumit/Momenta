import { ActionTypes, CourseSettingsAction } from "../actions";
import { CourseSettings } from "../actions/courseSettings"

const initialState = {}


export const courseSettingReducer = (state: CourseSettings = initialState, action: CourseSettingsAction) => {
  switch (action.type) {
    case ActionTypes.ChangeCourseBackground:
      const { backgroundMusic } = action.payload;
      return {
        ...state,
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          backgroundMusic,
        }
      }
    case ActionTypes.FinishedCourseLesson:
      const { lessonId } = action.payload;
      return {
        ...state,
        [action.payload.courseId]: {
          ...state[action.payload.courseId],
          [lessonId]: {
            finished: true,
          },
        }
      }
    default:
      return state;
  }
}