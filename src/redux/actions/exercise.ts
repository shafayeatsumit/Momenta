import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { downloadFile, getDownloadPath } from "../../helpers/downloader";
import _ from "lodash";
import { backgroundMusicReducer } from '../reducers/backgroundMusic';

const EXERCISE_URL = "exercise";

export interface Exercise {
  id: string;
  name: string;
  displayName: string;
  exerciseType: string;
  duration: number;
  primaryColor: string;
  backgroundGradient: Array<string>;
  targetInhale?: number;
  targetExhale?: number;
  targetDuration?: number;
  inhaleHoldTime?: number;
  exhaleHoldTime?: number;
  calibrationInhale?: number;
  calibrationExhale?: number;
  thumbnail: string;
  thumbnailTitle: string;
  thumbnailSubtitle: string;
  about: string;
  tips: string;
  level: string;
  thumbnailPath?: string;
  backgroundImage: string;
  backgroundImagePath?: string;
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
    let exercises: Exercise[] = response.data.exercises
    const filePromises: any = []
    exercises = exercises.map((exercise) => {
      const thumbnailName = exercise.name + "_" + "thumbnail";
      const thumbnailUrl = exercise.thumbnail;
      const thumbnailPath = getDownloadPath(thumbnailName, thumbnailUrl);
      const background = exercise.name + "_" + "background";
      const backgroundUrl = exercise.backgroundImage;
      const backgroundImagePath = getDownloadPath(background, backgroundUrl);
      const backgroundDownloadPromise: Promise<string> = downloadFile(backgroundUrl, backgroundImagePath);
      const thumbnailDownloadPromise: Promise<string> = downloadFile(thumbnailUrl, thumbnailPath);
      filePromises.push(thumbnailDownloadPromise)
      filePromises.push(backgroundDownloadPromise)
      return {
        ...exercise,
        thumbnailPath,
        backgroundImagePath,
      }
    })
    const exercisePayload: any = _.mapKeys(exercises, "id");
    const completePromise = await Promise.all(filePromises);
    console.log('++ done downloading exercises ++');
    dispatch<FetchExerciseAction>({
      type: ActionTypes.AddExercise,
      payload: exercisePayload,
    })
  }
}