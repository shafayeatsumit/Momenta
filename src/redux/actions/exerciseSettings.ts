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

export interface ChangeRhythmAction {
  type: ActionTypes.ChangeExerciseRhythm,
  payload: {
    exerciseId: string,
    rhythm: string,
  }
}

export interface ChangeVibrationTypeAction {
  type: ActionTypes.ChangeVibrationType,
  payload: {
    exerciseId: string,
    vibrationType: boolean,
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

export const changeRhythm = (exerciseId: string, rhythm: string): ChangeRhythmAction => {
  return {
    type: ActionTypes.ChangeExerciseRhythm,
    payload: {
      exerciseId,
      rhythm,
    }
  }
}


export const changeVibrationType = (exerciseId: string, vibrationType: boolean): ChangeVibrationTypeAction => {
  return {
    type: ActionTypes.ChangeVibrationType,
    payload: {
      exerciseId,
      vibrationType,
    }
  }
}