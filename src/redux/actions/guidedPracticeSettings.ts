import { ActionTypes } from "./types"

interface guidedPracticeSettings {
  backgroundMusic: string | null,
  lastPlayed: string | null,
}

export interface GuidedPracticeSettings {
  [id: string]: guidedPracticeSettings,
}


export interface ChangePracticeMusicAction {
  type: ActionTypes.ChangePracticeMusic,
  payload: {
    practiceId: string,
    musicId: string,
  }
}

export interface UpdateLastPracticeAction {
  type: ActionTypes.UpdateLastPractice,
  payload: {
    practiceId: string,
    trackId: string,
  }
}

export const changePracticeMusic = (practiceId: string, musicId: string): ChangePracticeMusicAction => {
  return {
    type: ActionTypes.ChangePracticeMusic,
    payload: {
      practiceId,
      musicId,
    }
  }
}

export const updateLastPractice = (practiceId: string, trackId: string) => {
  return {
    type: ActionTypes.UpdateLastPractice,
    payload: {
      practiceId,
      trackId,
    }
  }
}