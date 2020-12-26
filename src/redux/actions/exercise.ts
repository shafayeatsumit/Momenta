import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { downloadFile, getDownloadPath } from "../../helpers/downloader";
import _ from "lodash";

const EXERCISE_URL = "exercise";

export interface Exercise {
  "_id": string;
  "name": string;
  "exerciseType": string;
  "duration": number,
  "targetInhale": number,
  "targetExhale": number,
  "targetDuration": number,
  "calibrationInhale": number,
  "calibrationExhale": number,
  "thumbnail": string,
  "exerciseLottieFile": string,
}

export interface Exercises {
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
      const lottieFileName = exercise.name + "_" + "exerciseLottieFile";
      const lottieFileUrl = exercise.exerciseLottieFile;
      const lottieFilePath = getDownloadPath(lottieFileName, lottieFileUrl);
      const thumbnailName = exercise.name + "_" + "thumbnail";
      const thumbnailUrl = exercise.thumbnail;
      const thumbnailPath = getDownloadPath(thumbnailName, thumbnailUrl);
      const thumbnailDownloadPromise: Promise<string> = downloadFile(thumbnailUrl, thumbnailPath)
      const lottieFileDownloadPromise: Promise<string> = downloadFile(lottieFileUrl, lottieFilePath)
      filePromises.push(thumbnailDownloadPromise)
      filePromises.push(lottieFileDownloadPromise)
      return {
        ...exercise,
        thumbnailPath,
        lottieFilePath,
      }
    })
    const exercisePayload: any = _.mapKeys(exercises, "_id");
    const completePromise = await Promise.all(filePromises);
    console.log('completed promise', exercises)
    dispatch<FetchExerciseAction>({
      type: ActionTypes.AddExercise,
      payload: exercisePayload,
    })
  }
}