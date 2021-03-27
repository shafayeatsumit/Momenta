import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const GUIDED_PRACTICE_URL = "guided-practices";

export interface GuidePractice {
  id: string,
  primaryColor: string,
  backgroundImage: string,
  thumbnail: string,
  thumbnailTitle: string,
  file: string,
  name: string,
  info: string,
  summary: string,
  duration: number,
  defaultMusic: string,
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
    console.log('guided practice', guidedPractices)
    const payload: any = _.mapKeys(guidedPractices, "name");
    dispatch<FetchGuidedPracticeAction>({
      type: ActionTypes.AddGuidedPractice,
      payload: payload,
    })
  }
}