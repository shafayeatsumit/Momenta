import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {Colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfScreen: {
    flex: 1,
    justifyContent: 'center',
  },
  pickerPlaceHolder: {
    alignSelf: 'center',
    color: 'black',
    width: 280,
    height: 43,
    fontFamily: FontType.Medium,
    fontSize: 18,
    paddingLeft: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'tomato',
    marginTop: 8,
  },
  textInput: {
    alignSelf: 'center',
    width: 280,
    height: 43,
    fontFamily: FontType.Medium,
    fontSize: 18,
    paddingLeft: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'tomato',
    marginTop: 8,
  },
  spacer: {
    height: 0,
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  roundButton: {
    height: 160,
    width: 160,
    backgroundColor: 'tomato',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
