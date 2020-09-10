import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const BOX_SIZE = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  circleContainer: {
    transform: [{rotateZ: '270deg'}],
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
  targetBoxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Colors.buttonBlue,
  },
  targetLine: {
    height: 20,
    alignSelf: 'center',
    width: 5,
    marginTop: -15,
    backgroundColor: '#6dd400',
  },
  box: {
    width: BOX_SIZE - 20,
    height: BOX_SIZE - 20,
  },
  topView: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    width: ScreenWidth,
    height: 150,
    // backgroundColor: 'yellow',
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
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  finishText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
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
    // backgroundColor: 'red',
  },
  quitButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'rgb(66,72,102)',
    fontSize: 20,
    textAlign: 'center',
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  musicIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  musicIconHolder: {
    position: 'absolute',
    bottom: 35,
    left: 30,
    zIndex: 3,
    // backgroundColor: 'white',
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});

export default styles;
