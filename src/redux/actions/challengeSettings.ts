import { ActionTypes } from "./types"

interface lessonSettings {
  isFinished: boolean,
  finishedAt: Date,
  backgroundMusic: string,
}


export interface ChallengeSettings {
  [id: string]: lessonSettings,
}


export interface ChangeChallengeBackgroundAction {
  type: ActionTypes.ChangeChallengeBackground,
  payload: {
    challengeId: string,
    backgroundMusic: number,
  }
}

export const changeChallengeBackground = (challengeId: string, backgroundMusic: string) => {
  return {
    type: ActionTypes.ChangeChallengeBackground,
    payload: {
      challengeId,
      backgroundMusic,
    }
  }
}

export interface FinishedChallengeLessonAction {
  type: ActionTypes.FinishedChallengeLesson,
  payload: {
    challengeId: string,
    lessonId: string,
  }
}


export const finishedChallengeLesson = (challengeId: string, lessonId: string) => {
  return {
    type: ActionTypes.FinishedChallengeLesson,
    payload: {
      challengeId,
      lessonId,
    }
  }
}