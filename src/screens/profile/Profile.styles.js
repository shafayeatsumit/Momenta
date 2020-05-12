import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';
const PROFILE_IMAGE_HEIGHT = ScreenHeight * 0.12;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(27,31,55)',
  },
  topRow: {
    flex: 2,
  },
  backgroundImageContainer: {
    flex: 3,
  },
  backgroundImage: {
    flex: 1,
    height: null,
    width: null,
  },
  profileImageContainer: {
    height: PROFILE_IMAGE_HEIGHT,
    width: PROFILE_IMAGE_HEIGHT,
    borderRadius: PROFILE_IMAGE_HEIGHT / 2,
    borderColor: 'white',
    borderWidth: 3,
    overflow: 'hidden',
  },
  profileImage: {
    flex: 1,
    height: null,
    width: null,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTitle: {
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: RFValue(18),
    textAlign: 'center',
  },
  profileName: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontWeight: '500',
    paddingTop: 10,
    fontSize: RFValue(22),
    textAlign: 'center',
    paddingVertical: 5,
  },
  score: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: RFValue(25),
    textAlign: 'center',
    paddingVertical: 5,
  },
  bottomRow: {
    flex: 3,
  },
});
export default styles;
