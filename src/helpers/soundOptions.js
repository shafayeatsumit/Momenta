import analytics from '@react-native-firebase/analytics';
const Sound = require('react-native-sound');
Sound.setCategory('Playback');
const soundFile = 'loop.mp3';

export default class SoundOptions {
  constructor(name) {
    this.playingFile1 = false;
    this.playingFile2 = false;
    this.soundFile1 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
    this.soundFile2 = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {});
  }
  stopMusic = () => {
    // this.playingFile1 && this.soundFile1.stop();
    // this.playingFile2 && this.soundFile2.stop();
    this.playingFile1 && this.soundFile1.setVolume(0);
    this.playingFile2 && this.soundFile2.setVolume(0);
    this.soundTimerOne && clearInterval(this.soundTimerOne);
    this.soundTimerOne && clearInterval(this.soundTimerTwo);
    this.playingFile1 && this.soundFile1.stop();
    this.playingFile2 && this.soundFile2.stop();
  };

  startMusic = () => {
    this.playSoundFileOne();
    this.soundFile1.setVolume(1);
  };

  completedPlayingSoundFile1 = () => {
    this.playingFile1 = false;
    this.soundTimerOne && clearInterval(this.soundTimerOne);
  };

  completedPlayingSoundFile2 = () => {
    this.playingFile2 = false;
    this.soundTimerTwo && clearInterval(this.soundTimerTwo);
  };

  playSoundFileTwo = () => {
    this.soundFile2.play(this.completedPlayingSoundFile2);
    this.playingFile2 = true;
    this.soundTimerTwo = setInterval(() => {
      this.soundFile2.getCurrentTime((seconds, isPlaying) => {
        if (seconds > 170 && this.playingFile1 === false) {
          this.playSoundFileOne();
        }
      });
    }, 500);
  };

  playSoundFileOne = () => {
    this.soundFile1.play(this.completedPlayingSoundFile1);
    this.playingFile1 = true;
    this.soundTimerOne = setInterval(() => {
      this.soundFile1.getCurrentTime((seconds, isPlaying) => {
        if (seconds > 170 && this.playingFile2 === false) {
          this.playSoundFileTwo();
          this.soundFile2.setVolume(1);
        }
      });
    }, 500);
  };
}
