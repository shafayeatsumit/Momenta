import SwellPlayer from "./SwellPlayer";

const Sound = require('react-native-sound');
// Enable playback in silence mode
Sound.setCategory('Playback');
let sound: any;

let swellPlayer: any = new SwellPlayer();
let exhaleSoundId: null | ReturnType<typeof setTimeout> = null;
let inhaleSoundId: null | ReturnType<typeof setTimeout> = null;


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

export const playBackgroundMusic = (filePath: string) => {
  sound = new Sound(filePath, "", (error: any) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    sound.play()
    sound.setNumberOfLoops(-1);
  });
}

export const stopBackgroundMusic = () => {
  if (sound) {
    sound.setVolume(0)
    sound.stop();
  }
}


export const playLesson = (fileURL: string) => {
  const lesson = new Sound(fileURL, null, (e: any) => {
    if (e) {
      console.log('error loading lesson:', e)
    } else {
      lesson.play()
    }
  })
}
