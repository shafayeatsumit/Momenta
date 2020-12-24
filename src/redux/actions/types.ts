import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";
import { FetchBackgroundMusicAction } from "./backgroundMusic";
export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
  AddBackgroundMusic = "ADD_BACKGROUND_MUSIC",
}

export type UserAction = SignUpAnonymouslyAction;
export type BackgroundMusicAction = FetchBackgroundMusicAction;
export type CountAction = AddCountAction | RemoveCountAction;

