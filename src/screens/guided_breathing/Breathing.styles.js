import {StyleSheet, Dimensions} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measurementContainer: {
    top: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    height: 180,
    width: 180,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.3,
    paddingHorizontal: 20,
  },
  bottomText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 27,
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
