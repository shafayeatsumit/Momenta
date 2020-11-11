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
  absolutePosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    height: 80,
    width: 80,
    alignSelf: 'center',
  },
  animationHide: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    backgroundColor: Colors.betterBlue,
    zIndex: 10,
  },
  text: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 5,
  },
  boldText: {
    fontFamily: FontType.SemiBold,
    color: Colors.cornflowerBlue,
  },

  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.3,
  },
  backbuttonHolder: {
    position: 'absolute',
    top: 20,
    left: 20,
    height: 45,
    width: 45,
    zIndex: 10,
  },
  backbutton: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
});
export default styles;
