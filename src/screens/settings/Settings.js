import React, { Component } from "react";
import PropTypes from "prop-types";
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  Picker,
  platform,
  ScrollView,
  Switch,
  StyleSheet
} from "react-native";
import {connect} from 'react-redux';
import Tag from './Tag';
import {ScreenHeight, ScreenWidth, PickerPlaceHolder} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';
import leftArrowIcon from '../../../assets/icons/arrow_left.png';
import downArrowIcon from '../../../assets/icons/icon_down.png';
import RNPickerSelect from 'react-native-picker-select';


const defaultPlaceHolder = {
};

const InhaleValues = [
    { label: '3s', value: 3 },
    { label: '4s', value: 4 },
    { label: '5s', value: 5 },
    { label: '6s', value: 6},  
]

const ExhaleValues = [
    { label: '3s', value: 3 },
    { label: '4s', value: 4 },
    { label: '5s', value: 5 },
    { label: '6s', value: 6 },  
    { label: '7s', value: 7 },  
    { label: '8s', value: 8 },  
]

const placeHolderStyle = {
  inputIOS: {
    ...PickerPlaceHolder,
  },
  inputAndroid: {
    ...PickerPlaceHolder,    
  },
};

class Settings extends Component {
  setExhaleValue = (value) => {
    const {inhaleTime} = this.props;
    inhaleTime<=value &&
        this.props.dispatch({type:'UPDATE_EXHALE_TIME',value})    
  }

  setInhaleValue = (value) =>     
    this.props.dispatch({type:'UPDATE_INHALE_TIME', value})
  
  switchBreathingTips = ()=> {
    const {dispatch} = this.props;        
    dispatch({type:'TOGGLE_BREATHING_TIPS'})
  }

  goHome = ()=> this.props.navigation.goBack();

  handleTagPress = (tagId) => {
    const {tagNames, dispatch} = this.props;    
    const updatedTags = tagNames.map((item)=> item.id === tagId ? {...item,selected:!item.selected}:item )    
    dispatch({type:'UPDATE_ACTIVE_TAG',tags:updatedTags})
  } 

  render() {

    const {inhaleTime,exhaleTime, breathingTipsStatus, tagNames} = this.props;
    const tags = tagNames.filter((tag)=>tag.name!=='Calm Breathing Tips');        
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.leftIconContainer} onPress={this.goHome}>
            <Image source={leftArrowIcon} style={styles.leftIcon}/>
          </TouchableOpacity>          
        </View>
        <View style={styles.pickersContainer}>
          <Text style={styles.title}>Breathing</Text>
          <View style={styles.dropDownContainer}>
            <Text style={styles.subTitle}>Inhale</Text>
            <View style={styles.pickerHolder}>
              <RNPickerSelect
                onValueChange={this.setInhaleValue}
                style={placeHolderStyle}
                placeholder={defaultPlaceHolder}
                items={InhaleValues}
                value={inhaleTime}
                useNativeAndroidPickerStyle={false}
              />  
              <Image source={downArrowIcon} style={styles.downIcon} pointerEvents="none"/>              
            </View>
          </View>
          <View style={styles.dropDownContainer}>          
            <Text style={styles.subTitle}>Exhale</Text>
            <View style={styles.pickerHolder}>
              <RNPickerSelect
                onValueChange={this.setExhaleValue}
                style={placeHolderStyle}
                placeholder={defaultPlaceHolder}
                items={ExhaleValues}
                value={exhaleTime}
                useNativeAndroidPickerStyle={false}
              />  
              <Image source={downArrowIcon} style={styles.downIcon} pointerEvents="none"/>              
            </View>            
          </View>          
          <View style={styles.dropDownContainer}>            
            <Text style={styles.subTitle}>Tips</Text>
            <View style={styles.switchHolder}>
              <Switch
                trackColor={{ false: "#787989", true: "#3c71de" }}
                thumbColor={ 'white' }   
                style={styles.switchStyle}             
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.switchBreathingTips}
                value={breathingTipsStatus}
              />            
            </View>
          </View>                    
        </View>        
        
        <View style={styles.tilesContainer}>
          <Text style={[styles.title,{paddingLeft:25}]}>Mini-meditations</Text>
          <ScrollView contentContainerStyle={styles.scrollView} >
            {tags.map((item) => (
              <Tag
                item={item}
                key={item.id}
                handlePress={() => this.handleTagPress(item.id)}                                
              />
            ))}
          </ScrollView>          
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {settings,tagNames } = state;
  
  const {inhaleTime, exhaleTime, breathingTips:breathingTipsStatus} = settings;
  return {    
    inhaleTime, exhaleTime, breathingTipsStatus,tagNames
  }
};

export default connect(mapStateToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#252a43'
  },
  backButtonContainer: {
    height:100,
    justifyContent:'center',
  },
  leftIconContainer: {
    height:50,
    width:50,
    left: 25,
    justifyContent:'center',    
  },
  leftIcon: {
    height:25,
    width:25,    
    tintColor:'white',    
  },
  downIcon:{
    alignSelf:'center',
    height:30,
    width:30,
    marginLeft:-50  ,     
  },
  pickersContainer: {
    flex:2,        
    paddingLeft:20,
  },
  switchStyle: {
    ...Platform.select({
      android: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]    
      },    
    })    
  },
  tilesContainer: {
    flex:3,    
    // padding:20,
  },
  title: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 28,    
  },
  dropDownContainer: {
   flex:1,
   alignItems:'center',
   flexDirection:'row', 
   paddingLeft:30 
  },
  pickerHolder:{
    flex:1,
    marginLeft:10,              
    flexDirection:'row',    
  },
  switchHolder: {
    flex:1,
    marginLeft:30,              
    flexDirection:'row',       
  },
  scrollView:{
    marginTop: 10,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: ScreenWidth * 0.05,    
  },
  subTitle: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,    
  }

});