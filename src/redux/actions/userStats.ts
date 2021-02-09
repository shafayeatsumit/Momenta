import { ActionTypes } from "./types"

export interface UpdateUserStatsAction {
  type: ActionTypes.UpdateUserStats,
  payload: userStat,
}


interface userStat {
  isFinished: boolean,
  lastFinishedLesson: number,
  courseId: number,
}

export interface UserStats {
  [id: string]: userStat,
}

export const updateUserStats = (courseId: number, lastFinishedLesson: number, isFinished: boolean): UpdateUserStatsAction => {
  return {
    type: ActionTypes.UpdateUserStats,
    payload: {
      courseId,
      lastFinishedLesson,
      isFinished,
    }
  }
}

