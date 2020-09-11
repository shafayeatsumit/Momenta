import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

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
    height: 10,
    alignSelf: 'center',
    width: 7,
    marginTop: -10,
    backgroundColor: '#6dd400',
  },
  box: {
    width: 160,
    height: 160,
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
