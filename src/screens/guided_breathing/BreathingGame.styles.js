import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  circleHolder: {
    height: 220,
    width: 220,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: Colors.cornflowerBlue,
  },
  centerText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default styles;
