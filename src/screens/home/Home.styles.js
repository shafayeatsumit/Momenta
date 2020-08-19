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
    height: 280,
    width: 270,
    justifyContent: 'space-around',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
  },
  button: {
    height: 50,
    width: 200,
    backgroundColor: Colors.darkBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.cornflowerBlue,
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    color: 'white',
  },
});

export default styles;
