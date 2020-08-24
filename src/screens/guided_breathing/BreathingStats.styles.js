import {StyleSheet} from 'react-native';
import {ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  resultContainer: {
    flex: 3,
    marginTop: 100,
  },
  buttonText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  smallText: {
    fontFamily: FontType.Regular,
    color: 'white',
    paddingTop: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  timeContainer: {
    height: 100,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  finishButton: {
    height: 60,
    width: 180,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: Colors.cornflowerBlue,
  },
});

export default styles;
