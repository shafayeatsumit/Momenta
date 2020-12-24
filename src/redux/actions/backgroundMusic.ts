import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import { downloadFile } from "../../helpers/downloader";

const BACKGROUND_MUSIC_URL = 'backgroundMusic';

export interface BackgroundMusic {
  _id: string;
  music: string;
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
    musicFiles.map((item: BackgroundMusic) => {
      const filePath = downloadFile(item.name, item.music)
      const musicFile = {
        ...item,
        filePath,
      }
      dispatch<FetchBackgroundMusicAction>({
        type: ActionTypes.AddBackgroundMusic,
        payload: musicFile,
      })
    });

  }
}