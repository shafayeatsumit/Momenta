import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {Colors} from '../../helpers/theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  musicIconHolder: {
    position: 'absolute',
    top: 40,
    left: 20,
    height: 60,
    width: 60,
    borderRadius: 15,
    zIndex: 5,
    resizeMode: 'contain',
  },
  musicIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    tintColor: '#F5F5F5',
    resizeMode: 'contain',
  },
});

export default styles;
