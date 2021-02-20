import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const GUIDED_PRACTICE_URL = "guidedPractice";

export interface Lesson {
  id: string;
  order: number;
  title: string;
  url: string;
}

export interface GuidePractice {
  id: string;
  name: string;
  backgroundGradient: Array<string>;
  thumbnail: string;
  thumbnailTitle: string;
  level: string;
  backgroundImage: string;
  lesons: Array<Lesson>;
  introLessons: Array<Lesson>;
  welcome: string;
  totalLessons: number;
  totalDuration: number;
  inhaleTime: number;
  exhaleTime: number;
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
    let guidedPractices: GuidePractice[] = response.data.guidedPractices;
    const payload: any = _.mapKeys(guidedPractices, "name");
    dispatch<FetchGuidedPracticeAction>({
      type: ActionTypes.AddGuidedPractice,
      payload: payload,
    })
  }
}