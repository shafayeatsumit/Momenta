import {StyleSheet} from 'react-native';
import {ScreenHeight} from '../../helpers/constants/common';
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
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  instructionTextHolder: {
    height: 300,
    width: 250,
  },
  instructionText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  initTextHolder: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    height: 100,
    width: 200,
  },

  initText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  initTextBold: {
    fontFamily: FontType.ExtraBold,
  },
});
export default styles;
