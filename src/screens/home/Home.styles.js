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
    height: 450,
    width: 400,
    justifyContent: 'space-around',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
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
});

export default styles;
