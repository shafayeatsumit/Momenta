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
    paddingLeft: 30,
    paddingRight: 20,
  },
  bottomRow: {
    height: '10%',
    backgroundColor: '#827397',
    width: ScreenWidth,
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 21,
    paddingBottom: 40,
  },
  content: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 24,
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
    //backgroundColor: 'transparent',
    zIndex: 3,
    backgroundColor: 'red',
  },
  rightTouchable: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ScreenWidth / 2,
    top: -20,
    zIndex: 3,
    backgroundColor: 'red',
    // backgroundColor: 'transparent',
  },
});

export default styles;
