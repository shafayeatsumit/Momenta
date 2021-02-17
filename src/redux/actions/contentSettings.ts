import { ActionTypes } from "./types"

export interface UpdateContentSettingsAction {
  type: ActionTypes.UpdateContentSettings,
  payload: {
    courseId: string,
    lastLesson: number,
  },
}

export interface ContentFinishedAction {
  type: ActionTypes.ContentFinished,
  payload: {
    courseId: string,
  }
}

export interface UpdateContentBackgroundMusicAction {
  type: ActionTypes.UpdateContentBackgroundMusic,
  payload: {
    courseId: string,
    backgroundMusic: string | null,
  }
}

interface contentSettings {
  backgroundMusic?: string | null,
  lastLesson: number,
  isFinished?: boolean,
}

export interface ContentSettings {
  [id: string]: contentSettings,
}

export const updateContentSettings = (courseId: string, lastLesson: number): UpdateContentSettingsAction => {
  return {
    type: ActionTypes.UpdateContentSettings,
    payload: {
      lastLesson,
      courseId,
    }
  }
}

export const contentFinished = (courseId: string): ContentFinishedAction => {
  return {
    type: ActionTypes.ContentFinished,
    payload: {
      courseId,
    }
  }
}

export const updateContentBackgroundMusic = (backgroundMusic: string) => {
  return {
    type: ActionTypes.UpdateContentBackgroundMusic,
    payload: {
      backgroundMusic,
    }
  }
}