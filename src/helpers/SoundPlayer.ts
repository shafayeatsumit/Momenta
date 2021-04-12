

const Sound = require('react-native-sound');
// Enable playback in silence mode
import SwellPlayer from "./SwellPlayer";

Sound.setCategory('Playback');

let sound: any;

let exhaleSoundId: null | ReturnType<typeof setTimeout> = null;
let inhaleSoundId: null | ReturnType<typeof setTimeout> = null;
let swellPlayer: any = new SwellPlayer();



export const startSwellExhale = (exhaleDuration: number) => {
  const fadeOutDuration = 1250;
  exhaleSoundId = setTimeout(() => {
    swellPlayer.stopExhaleSound(fadeOutDuration);
    exhaleSoundId && clearTimeout(exhaleSoundId);
  }, exhaleDuration * 1000 - fadeOutDuration);
  swellPlayer.startExhaleSound();
};

export const startSwellInhale = (inhaleDuration: number) => {
  const fadeOutDuration = 1250;
  inhaleSoundId = setTimeout(() => {
    swellPlayer.stopInhaleSound(fadeOutDuration);
    inhaleSoundId && clearInterval(inhaleSoundId);
  }, inhaleDuration * 1000 - fadeOutDuration);
  swellPlayer.startInhaleSound();
};



export const stopSwellSound = () => {
  swellPlayer.stopSound();
  inhaleSoundId && clearInterval(inhaleSoundId);
  exhaleSoundId && clearTimeout(exhaleSoundId);
}

export const playBackgroundMusic = (file: string, volume = 1) => {
  sound = new Sound(
    file,
    Sound.MAIN_BUNDLE,
    (error: any) => {
      console.log('error loading swell file', error);
    },
  );
  setTimeout(() => {
    sound.setNumberOfLoops(-1);
    sound.play()
  }, 500)


}

export const stopBackgroundMusic = () => {
  if (sound) {
    sound.setVolume(0)
    sound.stop();
  }
}




