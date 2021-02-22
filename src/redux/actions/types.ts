import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";
import {
  UpdateContentSettingsAction, UpdateContentVibrationTypeAction, ListenedIntroLessonAction,
  UpdateContentBackgroundMusicAction, ContentFinishedAction, ListenedWelcomeLessonAction,
  ListenedLessonAction,
} from "./contentSettings";
import { FetchExerciseAction } from "./exercise";
import { ChangeVibrationAction, ChangeMusicAction } from "./settings";
import { FetchCourseAction } from "./course";
import { FetchGuidedPracticeAction } from "./guidedPractice";

export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddExercise = "ADD_EXERCISE",
  AddCourse = "ADD_COURSE",
  AddGuidedPractice = "ADD_GUIDED_PRACTICE",
  FetchCompleted = "FETCH_COMPLETED",
  ChangeVibrationType = "CHANGE_VIBRATION_TYPE",
  ChangeBackgroundMusic = "CHANGE_BACKGROUND_MUSIC",
  UpdateContentSettings = "UPDATE_CONTENT_SETTINGS",
  UpdateContentBackgroundMusic = "UPDATE_CONTENT_MUSIC",
  UpdateContentVibrationType = "UPDATE_CONTENT_VIBRATION_TYPE",
  ListenedWelcomeLesson = "LISTENED_WELCOME_LESSON",
  ListenedIntroLesson = "LISTENED_INTRO_LESSON",
  ListenedLesson = "LISTENED_LESSON",
  FinishedCourse = "FINISHED_COURSE",
  ContentFinished = "CONTENT_FINISHED",
}


export type UserAction = SignUpAnonymouslyAction;
export type ContentSettingsAction = ListenedLessonAction | ListenedIntroLessonAction | ListenedWelcomeLessonAction | ContentFinishedAction | UpdateContentVibrationTypeAction | UpdateContentSettingsAction | UpdateContentBackgroundMusicAction;
export type SettingsAction = ChangeVibrationAction | ChangeMusicAction;
export type ExerciseAction = FetchExerciseAction;
export type CountAction = AddCountAction | RemoveCountAction;
export type FetchCompletedAction = FetchExerciseAction;
export type CourseAction = FetchCourseAction;
export type GuidedPracticeAction = FetchGuidedPracticeAction;