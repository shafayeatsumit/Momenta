import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";
import { FetchBackgroundMusicAction } from "./backgroundMusic";
import { FetchExerciseAction } from "./exercise";
import { ChangeVibrationAction, ChangeMusicAction } from "./settings";

export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddBackgroundMusic = "ADD_BACKGROUND_MUSIC",
  AddExercise = "ADD_EXERCISE",
  FetchCompleted = "FETCH_COMPLETED",
  ChangeBackgroundMusic = "CHANGE_BACKGROUND_MUSIC",
  ChangeVibrationType = "CHANGE_VIBRATION_TYPE",
}

export type UserAction = SignUpAnonymouslyAction;
export type SettingsAction = ChangeVibrationAction | ChangeMusicAction;
export type BackgroundMusicAction = FetchBackgroundMusicAction;
export type ExerciseAction = FetchExerciseAction;
export type CountAction = AddCountAction | RemoveCountAction;
export type FetchCompletedAction = FetchBackgroundMusicAction | FetchExerciseAction;
