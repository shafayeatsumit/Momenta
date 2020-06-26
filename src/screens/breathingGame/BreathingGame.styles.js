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
    zIndex: 1,
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 36,
    marginHorizontal: 15,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
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
    height: 120,
    width: ScreenWidth,
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
  },
  tapIcon: {
    height: 110,
    width: 110,
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.35,
  },
  breathCountContainer: {
    top: 40,
    right: 0,
    left: 0,
    position: 'absolute',
    height: 60,
    width: ScreenWidth,
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    zIndex: 1,
  },
  breathCountText: {
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 25,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  arrowIconContainer: {
    top: 40,
    right: 20,
    position: 'absolute',
    height: 50,
    width: 50,
    marginTop: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  arrowIcon: {
    height: 30,
    width: 30,
    tintColor: 'white',
  },
});
export default styles;
