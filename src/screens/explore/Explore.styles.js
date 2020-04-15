import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const ICON_SIZE = RFValue(30);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  cancelButton: {
    paddingHorizontal: 15,
  },
  cancelText: {
    fontFamily: FontType.Medium,
    fontSize: RFValue(18),
    color: '#ffffff',
  },
  tilesContainer: {
    marginTop: 10,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: ScreenWidth * 0.05,
  },
  miminizedView: {
    width: ScreenWidth,
    height: ScreenHeight * 0.08,
    backgroundColor: '#31396C',
    borderBottomWidth: 0.3,
    borderBottomColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
  },
  minimizedContentHolder: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  minimizedIconHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizeCategory: {
    fontFamily: FontType.SemiBold,
    fontSize: RFValue(20),
    color: '#ffffff',
  },

  minimizeProgress: {
    fontFamily: FontType.SemiBold,
    fontSize: RFValue(18),
    color: '#7d7e8d',
    paddingLeft: 10,
  },
  startButton: {
    position: 'absolute',
    alignSelf: 'center',
    height: 50,
    width: ScreenWidth * 0.7,
    borderRadius: 5,
    backgroundColor: '#3D71DE',
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    fontFamily: FontType.SemiBold,
    fontSize: 20,
    color: 'white',
  },
  closeIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
  },
});

export default styles;
