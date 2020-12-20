import { ActionTypes } from "./types"

export interface AddCountAction {
  type: ActionTypes.addCount,
  payload: number,
}

export interface RemoveCountAction {
  type: ActionTypes.removeCount,
  payload: number,
}


export const addCount = (count: number): AddCountAction => {
  return {
    type: ActionTypes.addCount,
    payload: count
  }
}

export const removeCount = (count: number): RemoveCountAction => {
  return {
    type: ActionTypes.removeCount,
    payload: count,
  }
}


