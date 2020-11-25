import {StyleSheet} from 'react-native';
import {ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    position: 'absolute',
    top: 48,
    height: 120,
    width: 300,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  descriptionBox: {
    position: 'absolute',
    top: 213,
    height: 120,
    width: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontType.ExtraBold,
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
  },
  streak: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    position: 'absolute',
    top: 180,
    alignSelf: 'center',
  },
  titleSm: {
    fontFamily: FontType.BradleyBold,
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  descriptionText: {
    fontFamily: FontType.Regular,
    fontSize: 15,
    textAlign: 'center',
    color: '#d8d8d8',
  },
  background: {
    flex: 1,
  },
  backbuttonHolder: {
    position: 'absolute',
    top: 20,
    left: 20,
    height: 45,
    width: 45,
  },
  backbutton: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  buttonContainer: {
    width: ScreenWidth,
    height: 170,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: ScreenWidth * 0.8,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonTransparent: {
    backgroundColor: 'rgba(37, 42, 67, 0.6)',
    flexDirection: 'row',
    paddingRight: 50,
    paddingLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonBlue: {
    backgroundColor: 'rgba(60, 113, 222, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextRight: {
    fontSize: 10,
    fontFamily: FontType.Regular,
    color: '#84959a',
    textAlign: 'center',
  },
  buttonText: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
  },
  rightButton: {
    position: 'absolute',
    right: 20,
    height: 18,
    width: 18,
    alignSelf: 'center',
    tintColor: '#84959a',
  },
});

export default styles;