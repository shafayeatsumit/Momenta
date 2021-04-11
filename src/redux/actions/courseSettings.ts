import { ActionTypes } from "./types"

interface lessonSettings {
  isFinished: boolean,
  finishedAt: Date,
  backgroundMusic: string,
}


export interface CourseSettings {
  [id: string]: lessonSettings,
}


export interface ChangeCourseBackgroundAction {
  type: ActionTypes.ChangeCourseBackground,
  payload: {
    courseId: string,
    backgroundMusic: number,
  }
}

export const changeCourseBackground = (courseId: string, backgroundMusic: string) => {
  return {
    type: ActionTypes.ChangeCourseBackground,
    payload: {
      courseId,
      backgroundMusic,
    }
  }
}

export interface FinishedCourseLessonAction {
  type: ActionTypes.FinishedCourseLesson,
  payload: {
    courseId: string,
    lessonId: string,
  }
}


export const finishedCourseLesson = (courseId: string, lessonId: string) => {
  return {
    type: ActionTypes.FinishedCourseLesson,
    payload: {
      courseId,
      lessonId,
    }
  }
}