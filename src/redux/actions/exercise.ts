import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { downloadFile, getDownloadPath } from "../../helpers/downloader";
import _ from "lodash";
import { backgroundMusicReducer } from '../reducers/backgroundMusic';

const EXERCISE_URL = "exercises";

export interface Exercise {
  id: string;
  name: string;
  primaryColor: string;
  thumbnail: string;
  summary: string;
  info: string;
  defaultMusic: string;
  backgroundImage: string;
}

export type Exercises = {
  [name: string]: Exercise;
}

export interface FetchExerciseAction {
  type: ActionTypes.AddExercise;
  payload: any;
}


export const fetchExercise = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(EXERCISE_URL)
    let exercises: Exercise[] = response.data
    const exercisePayload: any = _.mapKeys(exercises, "id");
    dispatch<FetchExerciseAction>({
      type: ActionTypes.AddExercise,
      payload: exercisePayload,
    })
  }
}