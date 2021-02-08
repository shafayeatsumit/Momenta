import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { eventSetUserId } from "../../helpers/analytics";
import { useRoute } from '@react-navigation/native';

const SING_UP_URL = 'user/signUpAnonymously';
const USER_URL = 'user';

interface UserCourse {
  isFinished: boolean,
  _id: string,
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
    const response = await api.post(SING_UP_URL, {});
    const user: User = response.data.user;
    eventSetUserId(user.id);
    dispatch<SignUpAnonymouslyAction>({
      type: ActionTypes.SignUpAnonymously,
      payload: user,
    })
  }
}

export const fetchUserStats = (userId: string) => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(`${USER_URL}/${userId}`)
    const userStats: User = response.user;
  }
}