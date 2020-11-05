const Sound = require('react-native-sound');
Sound.setCategory('Playback');

export default class InhaleExhaleSound {
  constructor(inhaleSound, exhaleSound) {
    this.inhaleSoundFile = inhaleSound;
    this.exhaleSoundFile = exhaleSound;

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

  stopAllSound = () => {
    this.inhaleSound.stop();
    this.exhaleSound.stop();
  };

  startInhaleSound = () => {
    this.inhaleSound.play();
    this.inhaleSound.setVolume(1);
    // this.fadeIn(10, this.inhaleSound);
  };

  stopExhaleSound = (duration) => {
    this.fadeOut(duration, this.exhaleSound);
  };

  startExhaleSound = () => {
    this.exhaleSound.play();
    this.exhaleSound.setVolume(1);
    // this.fadeIn(10, this.exhaleSound);
  };

  stopInhaleSound = (duration) => {
    this.fadeOut(duration, this.inhaleSound);
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
      // console.log(val)
      file.setVolume(volume);
      requestAnimationFrame(doFadeOut);
    };
    doFadeOut();
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
