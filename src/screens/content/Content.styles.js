import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const ICON_SIZE = RFValue(30);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  topRow: {
    height: ScreenHeight * 0.2,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bottomRow: {
    // height: ScreenHeight * 0.6,
  },
  categoryContainer: {
    height: ScreenHeight * 0.1,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  thoughtContainer: {
    marginTop: 50,
    height: ScreenHeight * 0.4,
    paddingHorizontal: 20,
  },
  footerContainer: {
    height: ScreenHeight * 0.13,
    marginLeft: 20,
    marginTop: 10,
    alignItems: 'flex-start',
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
    fontSize: RFValue(36),
    textAlign: 'left',
    paddingRight: 20,
    zIndex: 1,
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  iconMore: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginRight: 20,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  iconDown: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginLeft: 10,
    paddingHorizontal: 10,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  bookmarkIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginTop: 5,
    marginLeft: 30,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  bookmarkColor: {
    tintColor: 'rgb(60,113,222)',
  },
  progressText: {
    fontSize: RFValue(12),
    color: 'white',
    fontFamily: FontType.Regular,
  },
});

export default styles;
