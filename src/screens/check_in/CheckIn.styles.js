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
  message: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    padding: 15,
    zIndex: 1,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  touchHandler: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.5,
  },
  progressContainer: {
    position: 'absolute',
    top: '5%',
    height: 40,
    width: 100,
    alignSelf: 'center',
    zIndex: 1,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  progressTextBig: {
    fontSize: 36,
  },
});

export default styles;
