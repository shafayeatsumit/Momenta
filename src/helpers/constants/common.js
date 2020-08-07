import {Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const PickerPlaceHolder = {
  color: 'white',
  width: 84,
  height: 43,
  fontFamily: 'Montserrat-Regular',
  fontSize: 14,
  paddingLeft: 16,
  borderRadius: 8,
  borderWidth: 0.7,
  borderColor: '#afbec5',
  marginTop: 8,
};

export {ScreenWidth, ScreenHeight, PickerPlaceHolder};
