import { AddCountAction, RemoveCountAction } from "./count";
import { SignUpAnonymouslyAction } from "./user";

export enum ActionTypes {
  SignUpAnonymously = "SIGN_UP_ANONYMOUSLY",
}

export type UserAction = SignUpAnonymouslyAction;
export type CountAction = AddCountAction | RemoveCountAction;

