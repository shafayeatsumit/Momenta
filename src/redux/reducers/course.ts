import { ActionTypes, CourseAction } from "../actions";
import { Courses } from "../actions/course";

const initialState = {}


export const courseReducer = (state: Courses | {} = initialState, action: CourseAction) => {
  switch (action.type) {
    case ActionTypes.AddCourse:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}