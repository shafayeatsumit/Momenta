import {StyleSheet, Dimensions} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const size = ScreenWidth - 50;
const BOX_SIZE = size - 40;
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

  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
});

export default styles;
