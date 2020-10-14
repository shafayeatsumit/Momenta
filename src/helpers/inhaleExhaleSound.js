const Sound = require('react-native-sound');
Sound.setCategory('Playback');
const soundFile = 'rain.mp3';

export default class inhaleExhaleSound {
  constructor() {
    this.audio = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }
  stopSound = () => {
    this.audio.stop();
  };
  startSound = () => {
    this.audio.play();
  };
}
