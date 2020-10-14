const Sound = require('react-native-sound');
Sound.setCategory('Playback');
const soundFile = 'loop.mp3';

export default class SoundOptions {
  constructor(name) {
    this.soundFile = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }

  stopMusic = () => {
    this.soundFile.stop();
  };

  startMusic = () => {
    this.soundFile.play();
    this.soundFile.setNumberOfLoops(-1);
  };
}
