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
import { FetchChallengeAction } from "./challenge";
import { ChangeExerciseMusicAction, ChangeRhythmAction, ChangeVibrationTypeAction } from "./exerciseSettings";
import { ChangePracticeMusicAction, UpdateLastPracticeAction } from "./guidedPracticeSettings";
import { FinishedChallengeLessonAction, ChangeChallengeBackgroundAction } from "./challengeSettings";
import { FinishedCourseLessonAction, ChangeCourseBackgroundAction } from "./courseSettings";

export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddExercise = "ADD_EXERCISE",
  AddCourse = "ADD_COURSE",
  AddGuidedPractice = "ADD_GUIDED_PRACTICE",
  AddChallenge = "ADD_CHALLENGE",
  FetchCompleted = "FETCH_COMPLETED",
  ChangeBackgroundMusic = "CHANGE_BACKGROUND_MUSIC",
  UpdateContentSettings = "UPDATE_CONTENT_SETTINGS",
  UpdateContentBackgroundMusic = "UPDATE_CONTENT_MUSIC",
  UpdateContentVibrationType = "UPDATE_CONTENT_VIBRATION_TYPE",
  ListenedWelcomeLesson = "LISTENED_WELCOME_LESSON",
  ListenedIntroLesson = "LISTENED_INTRO_LESSON",
  ListenedLesson = "LISTENED_LESSON",
  FinishedCourseLesson = "FINISHED_COURSE_LESSON",
  ChangeCourseBackground = "CHANGE_COURSE_BACKGROUND",
  FinishedCourse = "FINISHED_COURSE",
  ContentFinished = "CONTENT_FINISHED",
  ChangeExerciseMusic = "CHANGE_EXERCISE_MUSIC",
  ChangeExerciseRhythm = "CHANGE_EXERCISE_RHYTHM",
  ChangeVibrationType = "CHANGE_VIBRATION_TYPE",
  ChangePracticeMusic = "CHANGE_PRACTICE_MUSIC",
  UpdateLastPractice = "UPDATE_LAST_PRACTICE",
  ChangeChallengeBackground = "CHANGE_CHALLENGE_BACKGROUND",
  FinishedChallengeLesson = "FINISHED_CHALLENGE_LESSON",
}

export type CourseSettingsAction = FinishedCourseLessonAction | ChangeCourseBackgroundAction;
export type ChallengeSettingsAction = FinishedChallengeLessonAction | ChangeChallengeBackgroundAction;
export type GuidedPracticeSettingsAction = ChangePracticeMusicAction | UpdateLastPracticeAction;
export type ExerciseSettingsAction = ChangeVibrationTypeAction | ChangeExerciseMusicAction | ChangeRhythmAction;
export type UserAction = SignUpAnonymouslyAction;
export type ContentSettingsAction = ListenedLessonAction | ListenedIntroLessonAction | ListenedWelcomeLessonAction | ContentFinishedAction | UpdateContentVibrationTypeAction | UpdateContentSettingsAction | UpdateContentBackgroundMusicAction;
export type SettingsAction = ChangeVibrationAction | ChangeMusicAction;
export type ExerciseAction = FetchExerciseAction;
export type ChallengeAction = FetchChallengeAction;
export type CountAction = AddCountAction | RemoveCountAction;
export type FetchCompletedAction = FetchExerciseAction;
export type CourseAction = FetchCourseAction;
export type GuidedPracticeAction = FetchGuidedPracticeAction;