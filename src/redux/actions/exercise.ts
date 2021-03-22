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
  exerciseType: string;
  duration: number;
  primaryColor: string;
  backgroundGradient: Array<string>;
  inhaleTime: number,
  exhaleTime: number,
  targetInhale?: number;
  targetExhale?: number;
  targetDuration?: number;
  inhaleHoldTime?: number;
  exhaleHoldTime?: number;
  thumbnail: string;
  thumbnailTitle: string;
  about: string;
  tips: string;
  defaultMusic: string;
  level: string;
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
    console.log('exercises', exercises);
    const exercisePayload: any = _.mapKeys(exercises, "id");
    dispatch<FetchExerciseAction>({
      type: ActionTypes.AddExercise,
      payload: exercisePayload,
    })
  }
}