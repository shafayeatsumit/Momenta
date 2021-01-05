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
    height: ScreenWidth * .8, width: ScreenWidth * .8,
  },
  start: {


  },

  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.6,
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

})

export default styles;