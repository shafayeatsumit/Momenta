

const Sound = require('react-native-sound');
// Enable playback in silence mode

Sound.setCategory('Playback');

let sound: any;

let exhaleSoundId: null | ReturnType<typeof setTimeout> = null;
let inhaleSoundId: null | ReturnType<typeof setTimeout> = null;

const inhaleSwellFile = new Sound(
  'swell_inhale.mp3',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    console.log('error loading swell file', error);
  },
);

const exhaleSwellFile = new Sound(
  'swell_exhale.mp3',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    console.log('error loading swell file', error);
  },
);




const swellFadeOut = (duration: number, file: any) => {
  const end = new Date().getTime() + duration;
  const doFadeOut = () => {
    const current = new Date().getTime();
    const remaining = end - current;

    if (remaining < 0) {
      // End animation here as there's less than 0 milliseconds left
      stopSwellSound();

      return;
    }
    // Change player volume
    const volume = remaining / duration;
    file.setVolume(volume);
    requestAnimationFrame(doFadeOut);
  };
  doFadeOut();
}

const startInhaleSwell = () => {
  inhaleSwellFile.setVolume(1);
  inhaleSwellFile.play();
}

const startExhaleSwell = () => {
  exhaleSwellFile.setVolume(1);
  exhaleSwellFile.play();
}

const stopInhaleSwell = (duration: number) => {
  swellFadeOut(duration, inhaleSwellFile);
  // inhaleSwellFile.stop();
}

const stopExhaleSwell = (duration: number) => {
  swellFadeOut(duration, exhaleSwellFile);
  // exhaleSwellFile.stop();
}

export const startSwellExhale = (exhaleDuration: number) => {
  const fadeOutDuration = 1250;
  exhaleSoundId = setTimeout(() => {
    stopExhaleSwell(fadeOutDuration)
    exhaleSoundId && clearTimeout(exhaleSoundId);
  }, exhaleDuration * 1000 - fadeOutDuration);
  startExhaleSwell();

};

export const startSwellInhale = (inhaleDuration: number) => {
  const fadeOutDuration = 1250;
  inhaleSoundId = setTimeout(() => {
    stopInhaleSwell(fadeOutDuration)
    inhaleSoundId && clearInterval(inhaleSoundId);
  }, inhaleDuration * 1000 - fadeOutDuration);
  startInhaleSwell();
};

export const stopSwellSound = () => {
  inhaleSwellFile.stop();
  exhaleSwellFile.stop();
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




