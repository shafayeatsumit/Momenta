import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  progressContainer: {
    position: 'absolute',
    top: '5%',
    height: 40,
    width: 100,
    alignSelf: 'center',
    zIndex: 1,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  progressTextBig: {
    fontSize: 36,
  },
  resultContainer: {
    flex: 3,
    marginTop: 100,
  },
  buttonText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
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
    width: 170,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: Colors.cornflowerBlue,
  },
});

export default styles;
