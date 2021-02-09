import { ActionTypes, UserStatsAction } from "../actions";
import { UserStats } from "../actions/userStats"

const initialState = {}


export const userStatsReducer = (state: UserStats | {} = initialState, action: UserStatsAction) => {
  switch (action.type) {
    case ActionTypes.UpdateUserStats:
      const { courseId, isFinished, lastFinishedLesson } = action.payload;
      return {
        ...state,
        [courseId]: {
          ...state[courseId],
          isFinished,
          lastFinishedLesson,
        }
      }
    default:
      return state;
  }
}