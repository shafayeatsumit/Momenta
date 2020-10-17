import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
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
  },
  text: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  boldText: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  instructionTextHolder: {
    height: 160,
    width: 160,
    // backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 80,
    backgroundColor: '#1b1f37',
    position: 'absolute',
    zIndex: 3,
  },
  instructionText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
    lineHeight: 20,
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
    bottom: ScreenHeight / 2 + 80,
  },
  initTextHolder: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    height: 160,
    width: ScreenWidth,
  },
  targetIcon: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    position: 'absolute',
    bottom: -120,
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
    alignSelf: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: '#1b1f37',
    bottom: 20,
    zIndex: 5,
  },
  animation: {
    height: 50,
    width: 50,
    alignSelf: 'center',
  },
});
export default styles;
