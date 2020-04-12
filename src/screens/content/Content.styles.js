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
    height: ScreenHeight * 0.3,
  },
  bottomRow: {
    height: ScreenHeight * 0.6,
  },
  categoryContainer: {
    height: '20%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  thoughtContainer: {
    height: '60%',
    paddingHorizontal: 20,
  },
  footerContainer: {
    height: '20%',
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
  // will remove
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default styles;
