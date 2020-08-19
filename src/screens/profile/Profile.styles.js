import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {Colors, FontType} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.betterBlue,
  },
  daysContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  days: {
    height: 34,
    width: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    backgroundColor: '#252a43',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  daysText: {
    fontFamily: FontType.Light,
    fontSize: 20,
    color: '#787989',
  },
  darkText: {
    color: '#252a43',
  },
  animContainer: {
    paddingHorizontal: 6,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  anim: {
    height: 34,
    width: 34,
  },
  white: {
    backgroundColor: 'white',
  },
  dark: {
    backgroundColor: '#252a43',
  },
  streakContainer: {
    marginTop: 40,
  },
  streak: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  leftIconContainer: {
    position: 'absolute',
    top: '5%',
    left: 10,
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    zIndex: 3,
  },
  leftIcon: {
    left: 10,
    height: 20,
    width: 20,
    tintColor: 'white',
  },
});
export default styles;
