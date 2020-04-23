import {StyleSheet} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
  },

  item: {
    height: ScreenHeight * 0.2,
    flex: 1,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 35,
  },
  progressConatiner: {
    marginTop: 20,
    marginLeft: 10,
    height: RFValue(25),
    width: RFValue(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: 30,
  },
  morphView: {
    height: ScreenHeight * 0.2,
    width: ScreenWidth - 50,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
  },
  contentTopRow: {
    flex: 1.2,
    flexDirection: 'row',
    paddingTop: 25,
    paddingHorizontal: 10,
    // backgroundColor: 'yellow',
  },
  dragIcon: {
    height: RFValue(25),
    width: RFValue(25),
  },
  setCategory: {
    fontFamily: FontType.Medium,
    fontSize: RFValue(18),
    fontWeight: '500',
    fontStyle: 'normal',
    color: 'rgb(111,112,127)',
    paddingHorizontal: 20,
  },
  bookmarkHolder: {
    position: 'absolute',
    top: 22,
    right: 20,
    zIndex: 3,
  },
  bookmarkIcon: {
    height: RFValue(25),
    width: RFValue(25),
  },
  contentBottomRow: {
    flex: 3,
    marginLeft: 50,
    marginRight: 30,
  },

  setContent: {
    fontFamily: FontType.Regular,
    fontSize: RFValue(17),
    lineHeight: RFValue(24),
    fontStyle: 'normal',
    color: 'white',
  },

  itemText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 12,
  },
  buttonHolder: {
    width: ScreenWidth,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 0.3,
    borderBottomColor: 'white',
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  startButton: {
    width: ScreenWidth * 0.7,
    backgroundColor: 'rgb(60,113,222)',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: 14,
  },
  shuffle: {
    height: 28,
    width: 28,
  },
  topShadow: {
    shadowColor: '#15182a',
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  bottomShadow: {
    shadowColor: '#212644',
    shadowOffset: {
      width: -4,
      height: -4,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
