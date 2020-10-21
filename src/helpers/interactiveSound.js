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

  startInhaleSound = () => {
    this.inhaleSound.play();
  };

  stopExhaleSound = () => {
    this.exhaleSound.stop();
  };

  startExhaleSound = () => {
    this.exhaleSound.play();
  };

  stopInhaleSound = () => {
    this.inhaleSound.stop();
  };
}
