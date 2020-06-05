import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.15,
    left: 0,
    width: ScreenWidth,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    height: 100,
    width: ScreenWidth / 2,
    left: ScreenWidth / 4,
    top: ScreenHeight / 2 + ScreenHeight * 0.2,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    height: 60,
    width: '45%',
  },
  buttonTouchable: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
  },
  buttonTextDim: {
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 20,
  },
  helperTextContainer: {
    position: 'absolute',
    width: ScreenWidth,
    zIndex: 1,
    bottom: ScreenHeight * 0.1,
  },
  timerHelperTextContainer: {
    position: 'absolute',
    width: ScreenWidth,
    zIndex: 1,
    bottom: ScreenHeight * 0.4,
  },
  timerText: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 18,
    marginHorizontal: 15,
  },
  successTextContainer: {
    position: 'absolute',
    width: ScreenWidth,
    zIndex: 1,
    bottom: ScreenHeight * 0.45,
  },
  helperText: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 18,
    marginHorizontal: 15,
  },
  successText: {
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    marginHorizontal: 15,
  },

  iconDownContainer: {
    zIndex: 1,
  },
  iconDown: {
    position: 'absolute',
    top: 30,
    left: 20,
    height: 35,
    width: 35,
    tintColor: 'rgba(255,255,255,0.8)',
    zIndex: 2,
  },
  iconStyle: {
    tintColor: 'white',
    height: 35,
    width: 35,
    resizeMode: 'cover',
    zIndex: 2,
  },
  tapIconHolder: {
    height: 80,
    width: 80,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  tapIcon: {
    height: 70,
    width: 70,
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.3,
  },
});
export default styles;
