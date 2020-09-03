import {StyleSheet, Dimensions} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const size = ScreenWidth - 50;
const BOX_SIZE = size - 40;

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
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#7da1e9',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
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
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 25,
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
    // left: 20,
    bottom: '8%',
    left: 35,
    zIndex: 3,
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default styles;
