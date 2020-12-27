import { Dispatch } from 'redux';
import _ from "lodash";
import { api } from '../../helpers/api';
import { ActionTypes } from './types';

import { downloadFile, getDownloadPath } from "../../helpers/downloader";

const BACKGROUND_MUSIC_URL = 'backgroundMusic';

export interface BackgroundMusic {
  _id: string;
  url: string;
  name: string;
  type: string;
  filePath?: string;
}

export type BackgroundMusics = {
  [name: string]: BackgroundMusic;
}

export interface FetchBackgroundMusicAction {
  type: ActionTypes.AddBackgroundMusic;
  payload: BackgroundMusics;
}


export const fetchBackgroundMusic = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(BACKGROUND_MUSIC_URL);
    let musicFiles: BackgroundMusic[] = response.data.musicFiles;
    const filePromises: Promise<string>[] = [];
    musicFiles = musicFiles.map((music: BackgroundMusic) => {
      const filePath = getDownloadPath(music.name, music.url);
      const fileDownloadPromise: Promise<string> = downloadFile(music.url, filePath)
      filePromises.push(fileDownloadPromise);
      return {
        ...music,
        filePath,
      }
    })
    const musicPayload: BackgroundMusics = _.mapKeys(musicFiles, "_id");
    // completes the primise;
    await Promise.all(filePromises);
    dispatch<FetchBackgroundMusicAction>({
      type: ActionTypes.AddBackgroundMusic,
      payload: musicPayload,
    })

    console.log('+++++++++++ suddd ++++++');
  }
}