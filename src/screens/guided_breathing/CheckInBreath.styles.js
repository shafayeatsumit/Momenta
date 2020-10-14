import {StyleSheet} from 'react-native';
import {ScreenHeight} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wave: {
    marginTop: 3,
    height: 20,
    width: 20,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBox: {
    height: 280,
    width: 200,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  instructionTextHolder: {
    height: 300,
    width: 300,
    justifyContent: 'center',
  },
  instructionText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  textHolder: {
    height: 90,
    width: 300,
    position: 'absolute',
    bottom: ScreenHeight / 2 + 50,
  },
  initTextHolder: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    height: 90,
    width: 250,
  },

  initText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  initTextBold: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  circleHolder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    width: 240,
    borderRadius: 120,
    backgroundColor: '#1b1f37',
    // zIndex: 55,
  },
  animation: {
    height: 100,
    width: 100,
  },
});
export default styles;
