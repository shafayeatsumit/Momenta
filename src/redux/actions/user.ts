import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { eventSetUserId } from "../../helpers/analytics";

const SING_UP_URL = 'user/signUpAnonymously';

export interface User {
  id: string;
  name: string;
  token: string;
  email: string;
}

export interface SignUpAnonymouslyAction {
  type: ActionTypes.SignUpAnonymously;
  payload: User;
}


export const signUpAnonymously = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.post(SING_UP_URL, {});
    const user: User = response.data.user;
    eventSetUserId(user.id);
    dispatch<SignUpAnonymouslyAction>({
      type: ActionTypes.SignUpAnonymously,
      payload: user,
    })
  }
}