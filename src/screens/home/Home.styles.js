import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 600,
    width: 400,
    borderRadius: 10,

    overflow: 'hidden',
  },
  tabBar: {
    height: 60,
    width: 300,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
  },
  tab: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  tabHighlight: {
    backgroundColor: Colors.cornflowerBlue,
  },
  tabText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
  },
  checkMarkHolder: {
    marginTop: 30,
    height: 200,
    width: '100%',
  },
  checkMark: {
    height: 50,
    marginLeft: 50,
    flexDirection: 'row',
  },
  unchecked: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    borderColor: 'white',
    borderWidth: 1,
    marginRight: 20,
  },
  fixedBreathingSettings: {
    marginTop: 30,
    height: 250,
    width: '100%',
    backgroundColor: 'red',
  },
  settingsContainer: {
    height: 50,
    marginHorizontal: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fixedBreathingType: {
    height: 200,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontFamily: FontType.Regular,
    fontSize: 20,
    color: 'white',
  },
  breathCounterContainer: {
    marginTop: 20,
    height: 40,
    width: 300,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breathCount: {
    fontFamily: FontType.Bold,
    fontSize: 25,
    color: 'white',
  },
  icon: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  plusIcon: {
    height: 33,
    width: 33,
    borderRadius: 33 / 2,
    tintColor: 'white',
  },
  minusIcon: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    tintColor: 'white',
  },
  plusIconSm: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    tintColor: 'white',
  },
  minusIconSm: {
    height: 22,
    width: 22,
    borderRadius: 22 / 2,
    tintColor: 'white',
  },
  whiteBackground: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  itemText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
  },

  button: {
    height: 80,
    width: 300,
    backgroundColor: Colors.darkBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.cornflowerBlue,
  },
  text: {
    fontFamily: FontType.SemiBold,
    fontSize: 20,
    color: 'white',
  },
  buttonText: {
    fontFamily: FontType.SemiBold,
    fontSize: 28,
    color: 'white',
  },
  startButton: {
    alignSelf: 'center',
    width: 180,
    height: 60,
    borderRadius: 5,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: FontType.Bold,
    fontSize: 26,
    color: 'white',
  },
  musicIcon: {
    height: 30,
    width: 30,
    borderRadius: 20,
    tintColor: '#F5F5F5',
    resizeMode: 'contain',
  },
  musicIconHolder: {
    position: 'absolute',
    bottom: '5%',
    left: 35,
    zIndex: 3,
    height: 30,
    width: 30,
    borderRadius: 20,
  },
});

export default styles;
