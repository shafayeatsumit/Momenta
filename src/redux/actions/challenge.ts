import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const CHALLENGES_URL = "challenges";

export interface Lesson {
  id: string,
  title: string,
  duration: number,
  order: number,
  url: string,
  listingTitle: string,
}


export interface Challenge {
  id: string,
  primaryColor: string,
  backgroundImage: string,
  thumbnail: string,
  thumbnailTitle: string,
  name: string,
  info: string,
  summary: string,
  lessons: Lesson[];
  defaultMusic: string,
  numberOfDays: number,
}

export type Challenges = {
  [name: string]: Challenge;
}

export interface FetchChallengeAction {
  type: ActionTypes.AddChallenge;
  payload: any;
}


export const fetchChallenge = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(CHALLENGES_URL);
    let challenges: Challenges[] = response.data;
    const payload: any = _.mapKeys(challenges, "name");
    dispatch<FetchChallengeAction>({
      type: ActionTypes.AddChallenge,
      payload: payload,
    })
  }
}

