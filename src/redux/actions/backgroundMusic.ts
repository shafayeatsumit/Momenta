import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { downloadFile, getDownloadPath } from "../../helpers/downloader";

const BACKGROUND_MUSIC_URL = 'backgroundMusic';

export interface BackgroundMusic {
  _id: string;
  url: string;
  name: string;
  type: string;
}

export interface FetchBackgroundMusicAction {
  type: ActionTypes.AddBackgroundMusic;
  payload: BackgroundMusic;
}


export const fetchBackgroundMusic = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(BACKGROUND_MUSIC_URL);
    const musicFiles: BackgroundMusic[] = response.data.musicFiles;
    musicFiles.map(async (music: BackgroundMusic) => {
      const filePath = getDownloadPath(music.name, music.url);
      const response = await downloadFile(music.url, filePath)
      const musicFile = {
        ...music,
        filePath,
      }
      dispatch<FetchBackgroundMusicAction>({
        type: ActionTypes.AddBackgroundMusic,
        payload: musicFile,
      })
    });
    console.log('suddd', musicFiles);
  }
}