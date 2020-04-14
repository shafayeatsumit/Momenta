import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const ICON_SIZE = RFValue(30);

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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bottomRow: {
    height: ScreenHeight * 0.6,
  },
  categoryContainer: {
    height: ScreenHeight * 0.1,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    // marginTop: 20,
  },
  thoughtContainer: {
    height: ScreenHeight * 0.4,
    paddingHorizontal: 20,
  },
  footerContainer: {
    height: ScreenHeight * 0.1,
    marginLeft: 20,
    flexDirection: 'row',
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: RFValue(24),
    paddingBottom: 40,
  },
  content: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: RFValue(30),
    textAlign: 'left',
    paddingRight: 20,
    zIndex: 1,
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
  },
  iconMore: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
    marginRight: 20,
  },
  iconDown: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  bookmarkIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
    marginTop: 5,
    marginLeft: 30,
  },
});

export default styles;
