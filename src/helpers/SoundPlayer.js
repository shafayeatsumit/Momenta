const Sound = require('react-native-sound');
Sound.setCategory('Playback');

export default class InhaleExhaleSound {
  constructor() {
    this.inhaleSoundFile = 'swell_inhale_three.mp3';
    this.exhaleSoundFile = 'swell_exhale_three.mp3';
    this.mute = false;
    this.started = false;
    this.inhaleSound = new Sound(
      this.inhaleSoundFile,
      Sound.MAIN_BUNDLE,
      (error) => {
        console.log('error loading file', error);
      },
    );
    this.exhaleSound = new Sound(
      this.exhaleSoundFile,
      Sound.MAIN_BUNDLE,
      (error) => {
        console.log('error loading exhale', error);
      },
    );
  }

  startInhaleSound = () => {
    if (this.mute) {
      this.inhaleSound.setVolume(0);
      console.log('mute inhale start');
    } else {
      this.inhaleSound.setVolume(1);
      this.inhaleSound.play();
      console.log('on inhale start');
    }
  };

  startExhaleSound = () => {
    if (this.mute) {
      this.exhaleSound.setVolume(0);
      console.log('mute exhale start');
    } else {
      this.exhaleSound.setVolume(1);
      this.exhaleSound.play();
      console.log('on exhale start');
    }
  };

  stopExhaleSound = (duration) => {
    this.fadeOut(duration, this.exhaleSound);
  };

  stopInhaleSound = (duration) => {
    this.fadeOut(duration, this.inhaleSound);
  };

  setVolumeToZero = () => {
    this.mute = true;
    this.exhaleSound.setVolume(0);
    this.inhaleSound.setVolume(0);
    // this.exhaleSound.stop();
    // this.inhaleSound.stop();
  };

  setVolumeToOne = () => {
    this.mute = false;
    this.exhaleSound.setVolume(1);
    this.inhaleSound.setVolume(1);
  };

  fadeOut(duration, file) {
    const end = new Date().getTime() + duration;
    const doFadeOut = () => {
      const current = new Date().getTime();
      const remaining = end - current;
      if (remaining < 0) {
        // End animation here as there's less than 0 milliseconds left
        file.stop();
        return;
      }
      // Change player volume
      const volume = remaining / duration;
      file.setVolume(volume);
      requestAnimationFrame(doFadeOut);
    };
    !this.mute && doFadeOut();
  }

  fadeIn(duration, file) {
    const end = new Date().getTime() + duration;
    const doFadeIn = () => {
      const current = new Date().getTime();
      const remaining = end - current;
      if (remaining < 0) {
        // End animation here as there's less than 0 milliseconds left
        return;
      }
      // Change player volume
      const volume = 1 - remaining / duration;
      // console.log(val)
      file.setVolume(volume);
      requestAnimationFrame(doFadeIn);
    };
    doFadeIn();
  }
}
