import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  sloganContainer: {
    marginTop: ScreenHeight * 0.2,
    marginHorizontal: 30,
  },
  sloganText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
  },
  introVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introVideo: {
    height: 500,
    width: 400,
  },
  introVideoText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
    padding: 20,
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 10,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
  touchableArea: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.5,
  },
  smallButtonContainer: {
    position: 'absolute',
    bottom: '8%',
    width: ScreenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonSm: {
    height: 50,
    width: 147,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: Colors.cornflowerBlue,
  },
  redoButtonSm: {
    height: 49,
    width: 147,
    borderRadius: 10,
    marginRight: 13,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
