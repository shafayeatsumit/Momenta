

const Sound = require('react-native-sound');
// Enable playback in silence mode
import TrackPlayer from 'react-native-track-player';

Sound.setCategory('Playback');
let sound: any;
let lesson: any;


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
  console.log('++++++++++fadeout++++++++++')
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
    console.log('stop exhale')
    exhaleSoundId && clearTimeout(exhaleSoundId);
  }, exhaleDuration * 1000 - fadeOutDuration);
  startExhaleSwell();

};

export const startSwellInhale = (inhaleDuration: number) => {
  const fadeOutDuration = 1250;
  inhaleSoundId = setTimeout(() => {
    stopInhaleSwell(fadeOutDuration)
    console.log('stop inhale')
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

export const playBackgroundMusic = (filePath: string, volume = 1) => {
  sound = new Sound(filePath, "", (error: any) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    sound.setVolume(volume);
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


export const prepareLesson = (fileURL: string) => {
  lesson = new Sound(fileURL, null, (e: any) => {
    if (e) {
      console.log('error loading lesson:', e)
      return;
    }
    console.log('lesson prepared');
  })

}

export const playLesson = (fileURL: string, lessonCompleteCB: Function) => {

  const start = async () => {
    // Set up the player
    await TrackPlayer.setupPlayer();

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: fileURL,
      title: 'Track Title',
      artist: 'Track Artist',
    });
    TrackPlayer.updateOptions({
        stopWithApp: true
    });
    // Start playing it
    await TrackPlayer.play();
    TrackPlayer.registerEventHandler((data) => {
      console.log('data', data);
      if (data.type === 'playback-queue-ended') {
        lessonCompleteCB();
      }
    })    
  };
  start();

}

export const stopLesson = () => {
  TrackPlayer.stop()
}