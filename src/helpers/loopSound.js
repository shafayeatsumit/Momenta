const Sound = require('react-native-sound');
Sound.setCategory('Playback');

export default class loopSound {
  constructor(soundFile) {
    this.audio = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      console.log('error loading file', error);
    });
  }
  stop = () => {
    this.audio.stop();
  };
  start = () => {
    console.log('starting the audio file');
    this.audio.play();
  };
}
