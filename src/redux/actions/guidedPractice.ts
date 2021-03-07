import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const GUIDED_PRACTICE_URL = "guided-practices";

export interface Lesson {
  id: string;
  order: number;
  title: string;
  url: string;
  artist: string;
  duration: number;
}

export interface GuidePractice {
  id: string;
  level: string;
  backgroundImage: string;
  thumbnail: string;
  lesons: Array<Lesson>;
  introLessons: Array<Lesson>;
  welcome: string;
  primaryColor: string;
  name: string;
  thumbnailTitle: string;
  about: string;
  totalDuration: number;
  backgroundGradient: Array<string>;
  totalLessons: number;
}

export type GuidePractices = {
  [name: string]: GuidePractice;
}

export interface FetchGuidedPracticeAction {
  type: ActionTypes.AddGuidedPractice;
  payload: any;
}

export const fetchGuidedPractice = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(GUIDED_PRACTICE_URL);
    let guidedPractices: GuidePractice[] = response.data;
    const payload: any = _.mapKeys(guidedPractices, "name");
    dispatch<FetchGuidedPracticeAction>({
      type: ActionTypes.AddGuidedPractice,
      payload: payload,
    })
  }
}