import {Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const PickerPlaceHolder = {
    color: 'white',
    height: 50,
    width:120,        
    fontFamily:'Montserrat-Medium',
    fontSize:20,
    paddingLeft:20,    
    marginLeft:30,
    borderRadius:20,
    borderWidth:1,
    borderColor:'white',

}

export {ScreenWidth, ScreenHeight, PickerPlaceHolder};
