import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";
import { UpdateUserStatsAction } from "./userStats";
import { FetchExerciseAction } from "./exercise";
import { ChangeVibrationAction, ChangeMusicAction } from "./settings";
import { FetchCourseAction } from "./course";

export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddExercise = "ADD_EXERCISE",
  AddCourse = "ADD_COURSE",
  FetchCompleted = "FETCH_COMPLETED",
  ChangeVibrationType = "CHANGE_VIBRATION_TYPE",
  ChangeBackgroundMusic = "CHANGE_BACKGROUND_MUSIC",
  UpdateUserStats = "UPDATE_USER_STATS",
  FinishedCourse = "FINISHED_COURSE",
}

export type UserAction = SignUpAnonymouslyAction;
export type UserStatsAction = UpdateUserStatsAction;
export type SettingsAction = ChangeVibrationAction | ChangeMusicAction;
export type ExerciseAction = FetchExerciseAction;
export type CountAction = AddCountAction | RemoveCountAction;
export type FetchCompletedAction = FetchExerciseAction;
export type CourseAction = FetchCourseAction;