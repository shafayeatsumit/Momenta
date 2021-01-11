// Import the react-native-sound module
var Sound = require('react-native-sound');

// Enable playback in silence mode
Sound.setCategory('Playback');

let sound: any;

export const Play = (filePath: string) => {
  new Sound(filePath, "", (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    sound.play()
    // loaded successfully
  });
}

export const Stop = () => {
  if (sound) {
    sound.stop();
  }

}

