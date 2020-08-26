import {StyleSheet, Dimensions} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const size = ScreenWidth - 50;

const BOX_SIZE = size - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measurementContainer: {
    top: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    height: 180,
    width: 180,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.3,
    paddingHorizontal: 20,
  },
  bottomText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 27,
    textAlign: 'center',
  },

  touchableArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.4,
  },
  // breathing
  boxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotateZ: '135deg'}],
  },
  dot: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#2162cc',
    // alignSelf: 'center',
    // marginTop: -40,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderColor: 'transparent',
    alignSelf: 'center',
    // backgroundColor: 'transparent',
    margin: BOX_SIZE / 2,
    // backgroundColor: '#F5FCFF',
  },
});
export default styles;
