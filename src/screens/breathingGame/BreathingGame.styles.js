import {StyleSheet, Dimensions} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
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
  menuIconContainer: {
    position: 'absolute',
    top: '5%',
    right: 0,
    zIndex: 1,
    height: 40,
    width: 65,
    alignItems: 'flex-end',
  },
  menuIcon: {
    right: 24,
    height: 24,
    width: 24,
    tintColor: 'white',
  },

  textWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingTextContainer: {
    width: ScreenWidth * 0.9,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingTextOverlay: {
    backgroundColor: 'rgba(27,31,55,0.5)',
  },
  breathingText: {
    textAlign: 'left',
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 30,
    paddingVertical: 10,
    paddingHorizontal: 2,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  tapIconHolder: {
    height: 100,
    width: ScreenWidth,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '5%',
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.35,
    backgroundColor: 'yellow',
  },
});
export default styles;
