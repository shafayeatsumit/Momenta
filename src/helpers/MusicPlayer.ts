// Import the react-native-sound module
const Sound = require('react-native-sound');

// Enable playback in silence mode
Sound.setCategory('Playback');

let sound: any;

export const PlayMusic = (filePath: string) => {

  sound = new Sound(filePath, "", (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    sound.play()
    sound.setNumberOfLoops(-1);
    // loaded successfully
  });
}

export const StopMusic = () => {
  if (sound) {
    sound.stop();
  }

}

