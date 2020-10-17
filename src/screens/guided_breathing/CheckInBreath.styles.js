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
  wave: {
    marginTop: 3,
    height: 20,
    width: 20,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBox: {
    height: 280,
    width: 200,
  },
  text: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  boldText: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  instructionTextHolder: {
    height: 170,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 170 / 2,
    backgroundColor: '#1b1f37',
    position: 'absolute',
    zIndex: 3,
  },
  instructionText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 12,
    lineHeight: 20,
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.3,
  },
  bottomTextHolder: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    height: 160,
    width: ScreenWidth,
  },
  targetIcon: {
    alignSelf: 'center',
    height: 220,
    width: 220,
    position: 'absolute',
    bottom: -120,
  },
  bottomText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  bottomTextBold: {
    fontFamily: FontType.ExtraBold,
    color: Colors.cornflowerBlue,
  },
  circleHolder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 170,
    width: 170,
    borderRadius: 170 / 2,
    backgroundColor: '#1b1f37',
    marginBottom: 80,
    zIndex: 5,
  },
  animation: {
    height: 50,
    width: 50,
    alignSelf: 'center',
  },
});
export default styles;
