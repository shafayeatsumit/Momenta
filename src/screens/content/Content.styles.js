import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    height: ScreenHeight / 2,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    height: ScreenHeight / 2.2,
    marginLeft: 30,
    justifyContent: 'flex-end',
  },
  middleRow: {
    flex: 1,
    marginLeft: 30,
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    paddingBottom: 40,
  },
  content: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
    paddingRight: 20,
    lineHeight: 40,
    zIndex: 1,
  },
  leftTouchable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ScreenWidth / 2,
    top: -20,
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  rightTouchable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ScreenWidth / 2,
    top: -20,
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  bottomRow: {
    height: '15%',
    backgroundColor: 'yellow',
    width: ScreenWidth,
  },
});

export default styles;
