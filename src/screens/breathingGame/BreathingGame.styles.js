import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

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

  progressContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    paddingTop: 18,
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
    fontFamily: FontType.ExtraBold,
    color: 'white',
    fontSize: 36,
    marginHorizontal: 15,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  tapIconHolder: {
    height: RFValue(150),
    width: ScreenWidth,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5,
  },
  tapIcon: {
    height: RFValue(100),
    width: RFValue(100),
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.35,
    backgroundColor: 'yellow',
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
    zIndex: 5,
  },
  breathCountText: {
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  arrowIconContainer: {
    top: 32,
    right: 3,
    position: 'absolute',
    height: 50,
    width: 60,
    marginTop: 5,
    alignItems: 'center',
    zIndex: 3,
  },
  arrowIcon: {
    height: 25,
    width: 25,
    tintColor: '#787989',
  },
});
export default styles;
