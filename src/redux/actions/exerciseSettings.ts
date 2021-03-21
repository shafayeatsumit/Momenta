import { ActionTypes } from "./types"

interface exerciseSettings {
  backgroundMusic: string | null,
  vibrationType: string | null,
  rhythm: number | null,
}

export interface ExerciseSettings {
  [id: string]: exerciseSettings,
}

export interface ChangeExerciseMusicAction {
  type: ActionTypes.ChangeExerciseMusic,
  payload: {
    exerciseId: string,
    musicId: string,
  }
}

export const changeMusic = (exerciseId: string, musicId: string): ChangeExerciseMusicAction => {
  return {
    type: ActionTypes.ChangeExerciseMusic,
    payload: {
      exerciseId,
      musicId,
    }
  }
}