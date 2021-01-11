import { ActionTypes } from "./types"

export interface Settings {
  backgroundMusic: string | null,
  vibrationType: string | null,
}

export interface ChangeMusicAction {
  type: ActionTypes.ChangeBackgroundMusic,
  payload: string | null,
}

export interface ChangeVibrationAction {
  type: ActionTypes.ChangeVibrationType,
  payload: string | null,
}

export const changeMusic = (id: string | null): ChangeMusicAction => {
  console.log('dispatch', id);
  return {
    type: ActionTypes.ChangeBackgroundMusic,
    payload: id,
  }
}

export const changeVibration = (id: string | null): ChangeVibrationAction => {
  return {
    type: ActionTypes.ChangeVibrationType,
    payload: id,
  }
}
