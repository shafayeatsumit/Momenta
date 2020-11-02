const INIT_STATE = {
  id: 'swell_one',
  inhaleFile: 'swell_exhale.mp3',
  exhaleFile: 'swell_inhale.mp3',
  backgroundMusic: null,
  name: 'Swell One',
  soundType: 'inhale_exhale',
};

const Sound = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_SOUND':
      console.log('action ++>', action);
      return {
        ...state,
        id: action.id,
        inhaleFile: action.inhaleFile,
        exhaleFile: action.exhaleFile,
        backgroundMusic: action.backgroundMusic,
        name: action.name,
        soundType: action.soundType,
      };
    default:
      return state;
  }
};

export default Sound;
