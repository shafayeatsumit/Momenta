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
  circleContainer: {
    transform: [{rotateZ: '270deg'}],
  },
  progressTrackerContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  boxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotateZ: '45deg'}],
  },
  dot: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Colors.buttonBlueDeep,
  },
  box: {
    width: 160,
    height: 160,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  resultContainer: {
    position: 'absolute',
    top: 0,
    marginTop: 50,
    height: 120,
    width: ScreenWidth,
    flexDirection: 'row',
  },
  resultTextHolder: {
    flex: 1,
    justifyContent: 'space-around',
  },
  textSm: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  finishButton: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 50,
    width: ScreenWidth,
    alignSelf: 'center',
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  musicIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  musicIconHolder: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    zIndex: 3,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: Colors.white,
    fontSize: 22,
    textAlign: 'center',
  },
  quitButton: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    height: 50,
    width: 60,
    zIndex: 3,
    justifyContent: 'center',
  },
  quitButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(66,72,102)',
    fontSize: 18,
    textAlign: 'center',
  },

  initTextHolder: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    height: 50,
    width: 200,
    // backgroundColor: 'yellow',
  },
  initText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  initTextBold: {
    fontFamily: FontType.ExtraBold,
  },
});

export default styles;
