import {duration} from 'moment';

const INIT_STATE = {
  id: 'swell_three',
  inhaleFile: 'swell_inhale_three.mp3',
  exhaleFile: 'swell_exhale_three.mp3',
  name: 'Swell Three',
  soundType: 'inhale_exhale',
  backgroundMusic: null,
  fadeOutDuration: 1000,
};

const Sound = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_SOUND':
      return {
        ...state,
        id: action.id,
        inhaleFile: action.inhaleFile,
        exhaleFile: action.exhaleFile,
        backgroundMusic: action.backgroundMusic,
        name: action.name,
        soundType: action.soundType,
      };
    case 'UPDATE_FADE_OUT':
      return {
        ...state,
        fadeOutDuration: action.duration,
      };
    default:
      return state;
  }
};

export default Sound;
