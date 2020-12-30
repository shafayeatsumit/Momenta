import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from '../../helpers/constants/common';
import { FontType, Colors } from '../../helpers/theme';


const styles = StyleSheet.create({
  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  lottieFile: {
    alignSelf: 'center',
    height: 280,
    width: 280,
  },
  start: {
    fontSize: 20,
    fontFamily: FontType.Bold,
    color: 'white',

  },
  playButton: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    backgroundColor: 'red',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    height: 50,
    width: 150,
    backgroundColor: Colors.buttonBlue,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: FontType.Medium,
    color: 'white',
  },
  timer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default styles;