import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";
import { FetchBackgroundMusicAction } from "./backgroundMusic";
import { FetchExerciseAction } from "./exercise";


export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddBackgroundMusic = "ADD_BACKGROUND_MUSIC",
  AddExercise = "ADD_EXERCISE",
  FetchCompleted = "FETCH_COMPLETED",
}

export type UserAction = SignUpAnonymouslyAction;
export type BackgroundMusicAction = FetchBackgroundMusicAction;
export type ExerciseAction = FetchExerciseAction;
export type CountAction = AddCountAction | RemoveCountAction;
export type FetchCompletedAction = FetchBackgroundMusicAction | FetchExerciseAction;
