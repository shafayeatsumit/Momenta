const Sound = require('react-native-sound');



// Enable playback in silence mode
Sound.setCategory('Playback');
let sound: any;


const backgroundFadeOut = (duration = 3000) => {
  return new Promise((resolve, reject) => {
    const end = new Date().getTime() + duration;

    const doFadeOut = () => {
      const current = new Date().getTime();
      const remaining = end - current;

      if (remaining < 0) {
        // End animation here as there's less than 0 milliseconds left      
        sound.setVolume(0);
        sound.stop();
        resolve(true);
        return;
      }
      // Change player volume
      const volume = remaining / duration;
      sound.setVolume(volume);
      // console.log('volume', volume)
      requestAnimationFrame(doFadeOut);
    };
    doFadeOut();

  })
}


const backgroundFadeIn = (duration = 5000) => {
  return new Promise((resolve, reject) => {
    const end = new Date().getTime() + duration;
    const doFadeIn = () => {
      const current = new Date().getTime();
      const remaining = end - current;
      if (remaining < 0) {
        // End animation here as there's less than 0 milliseconds left
        // file.stop();

        resolve(true)
        return;
      }
      // Change player volume
      const volume = 1 - remaining / duration;
      sound.setVolume(volume);
      requestAnimationFrame(doFadeIn);
    };
    doFadeIn();
  })
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

export const fadeInBackground = () => {
  sound.setVolume(0)
  setTimeout(() => {
    sound.play()
    backgroundFadeIn();
  }, 1000)
}



export const stopBackgroundMusic = () => {
  if (sound) {
    sound.setVolume(0)
    sound.stop();
  }
}


