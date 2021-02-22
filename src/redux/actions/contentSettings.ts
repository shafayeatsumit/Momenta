import { ActionTypes } from "./types"

export interface UpdateContentSettingsAction {
  type: ActionTypes.UpdateContentSettings,
  payload: {
    contentId: string,
    lastLesson: number,
  },
}

export interface ContentFinishedAction {
  type: ActionTypes.ContentFinished,
  payload: {
    contentId: string,
  }
}

export interface UpdateContentBackgroundMusicAction {
  type: ActionTypes.UpdateContentBackgroundMusic,
  payload: {
    contentId: string,
    backgroundMusic: string | null,
  }
}

export interface UpdateContentVibrationTypeAction {
  type: ActionTypes.UpdateContentVibrationType,
  payload: {
    contentId: string,
    vibrationType: string | null,
  }
}

export interface ListenedWelcomeLessonAction {
  type: ActionTypes.ListenedWelcomeLesson,
  payload: {
    contentId: string,
  }
}

export interface ListenedIntroLessonAction {
  type: ActionTypes.ListenedIntroLesson,
  payload: {
    contentId: string,
    introLessonOrder: number,
  }
}

export interface ListenedLessonAction {
  type: ActionTypes.ListenedLesson,
  payload: {
    contentId: string,
    lessonOrder: number,
  }
}

interface contentSettings {
  backgroundMusic?: string | null,
  lastLesson: number,
  lastIntroLesson?: number,
  listenedWelcome?: boolean,
  isFinished?: boolean,
  vibrationType?: string | null,
}

export interface ContentSettings {
  [id: string]: contentSettings,
}

export const updateContentSettings = (contentId: string, lastLesson: number): UpdateContentSettingsAction => {
  return {
    type: ActionTypes.UpdateContentSettings,
    payload: {
      lastLesson,
      contentId,
    }
  }
}

export const contentFinished = (contentId: string): ContentFinishedAction => {
  return {
    type: ActionTypes.ContentFinished,
    payload: {
      contentId,
    }
  }
}

export const updateContentBackgroundMusic = (contentId: string, backgroundMusic: string | null) => {
  return {
    type: ActionTypes.UpdateContentBackgroundMusic,
    payload: {
      contentId,
      backgroundMusic,
    }
  }
}

export const updateContentVibrationType = (contentId: string, vibrationType: string | null) => {
  return {
    type: ActionTypes.UpdateContentVibrationType,
    payload: {
      contentId: contentId,
      vibrationType,
    }
  }
}

export const listenedWelcomeLesson = (contentId: string) => {
  return {
    type: ActionTypes.ListenedWelcomeLesson,
    payload: {
      contentId,
    }
  }
}

export const listenedIntroLesson = (contentId: string, order: number) => {
  return {
    type: ActionTypes.ListenedIntroLesson,
    payload: {
      contentId,
      introLessonOrder: order,
    }
  }
}

export const listenedLesson = (contentId: string, order: number) => {
  return {
    type: ActionTypes.ListenedLesson,
    payload: {
      contentId,
      lessonOrder: order,
    }
  }
}