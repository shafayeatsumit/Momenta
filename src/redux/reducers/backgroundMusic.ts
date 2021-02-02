


export interface BackgroundMusic {
  id: string;
  fileName: string;
  name: string;
}


const initState = [
  { id: 'wind', fileName: 'wind.wav', name: 'Wind' },
  { id: 'river', fileName: 'river.wav', name: 'River' },
  { id: 'rain', fileName: 'rain.wav', name: 'Rain' },
];

export const backgroundMusicReducer = () => initState;