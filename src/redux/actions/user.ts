import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { eventSetUserId } from "../../helpers/analytics";

import UUIDGenerator from 'react-native-uuid-generator';

const SING_UP_URL = 'auth/local/register';
const USER_URL = 'user';

interface UserCourse {
  isFinished: boolean,
  id: string,
  courseId: string,
  lastLesson: number,
}

export interface User {
  id?: string;
  name?: string;
  token?: string;
  email?: string;
  courses: UserCourse[];
  challenges: [],
}


export interface SignUpAnonymouslyAction {
  type: ActionTypes.SignUpAnonymously;
  payload: User;
}


export const signUpAnonymously = () => {
  return async (dispatch: Dispatch) => {
    const uuid: string = await UUIDGenerator.getRandomUUID();
    const randomPass = Math.random().toString(36).substring(10);
    console.log('random uuid', uuid);
    const response = await api.post(SING_UP_URL, {
      "email": `${uuid}@momenta.com`,
      "password": randomPass,
      "username": uuid
    });

    const userResponse = response.data;
    const payload: User = {
      token: userResponse.jwt,
      id: userResponse.user.id,
      email: userResponse.user.email,
      name: userResponse.user.username,
      courses: [],
      challenges: [],
    }

    eventSetUserId(payload.id);
    dispatch<SignUpAnonymouslyAction>({
      type: ActionTypes.SignUpAnonymously,
      payload,
    })
  }
}

