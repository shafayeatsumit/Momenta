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
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
    zIndex: 3,
  },
  musicIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    tintColor: '#F5F5F5',
    resizeMode: 'contain',
  },
  musicIconHolder: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    zIndex: 5,
    resizeMode: 'contain',
  },
  quitButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  quitButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(66,72,102)',
    fontSize: 15,
    textAlign: 'center',
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  finishButton: {
    position: 'absolute',
    bottom: 30,
    height: 70,
    width: 120,
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 5,
  },

  initTextHolder: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    height: 50,
    width: 200,
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
  checkmarkHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  checkmark: {
    height: 300,
    width: 300,
  },
});

export default styles;
