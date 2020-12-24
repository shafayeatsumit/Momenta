import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';

const SING_UP_URL = 'user/signUpAnonymously';

export interface User {
  _id: string;
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
    dispatch<SignUpAnonymouslyAction>({
      type: ActionTypes.SignUpAnonymously,
      payload: user,
    })
  }
}