import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import Tag from './Tag';
import {ScreenWidth, PickerPlaceHolder} from '../../helpers/constants/common';
import {handleTagSelect} from '../../redux/actions/tag';
import {FontType} from '../../helpers/theme';
import leftArrowIcon from '../../../assets/icons/arrow_left.png';
import downArrowIcon from '../../../assets/icons/icon_down.png';
import RNPickerSelect from 'react-native-picker-select';
import analytics from '@react-native-firebase/analytics';

const defaultPlaceHolder = {};

const InhaleValues = [
  {label: '3s', value: 3},
  {label: '4s', value: 4},
  {label: '5s', value: 5},
];

const ExhaleValues = [
  {label: '3s', value: 3},
  {label: '4s', value: 4},
  {label: '5s', value: 5},
  {label: '6s', value: 6},
];

const BreathNumbers = [  
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
  {label: '7', value: 7},
  {label: '8', value: 8},
  {label: '9', value: 9},
  {label: '10', value: 10},
];

const AdditionBreathNumbers = [      
  {label: '+2', value: 2},
  {label: '+3', value: 3},
  {label: '+4', value: 4},
  {label: '+5', value: 5},
  {label: '+6', value: 6},
  {label: '+7', value: 7},
  {label: '+8', value: 8},
  {label: '+9', value: 9},
  {label: '+10', value: 10},  
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
  constructor(props) {
    super(props);
    this.state = {
      breathValue: props.breathPerSession,
      pickedBreathValue:false,
    }
  } 

  setExhaleValue = (value) => {
    const {dispatch} = this.props;
    dispatch({type: 'UPDATE_EXHALE_TIME', value});
  };

  setInhaleValue = (value) => {
    const {dispatch} = this.props;
    dispatch({type: 'UPDATE_INHALE_TIME', value});
  };

  setBreathNumber = (value) => {      
    if(Platform.OS==='android'){
      this.setState({breathValue:value,pickedBreathValue:true})
    } else {
      this.setState({breathValue:value})
    }   
    
  };

  handleDonePressBreathValuePicker = () => {
    this.setState({pickedBreathValue:true})
  }

  goHome = () => {
    const {dispatch,currentSession} = this.props;
    const {breathValue, pickedBreathValue } =this.state;
    this.props.navigation.goBack();
    if(!pickedBreathValue){
      return
    }

    if(currentSession.breathCount===0){
      dispatch({type: 'UPDATE_BREATH_PER_SESSION', breathCount: breathValue});
    }else {
      dispatch({type: 'ADD_EXTRA_BREATH', breathCount: breathValue})    
    }        
    
  }

  handleTagPress = (tagId) => {
    const {dispatch} = this.props;
    dispatch(handleTagSelect(tagId));
  };

  render() {
    const {
      inhaleTime,
      exhaleTime,
      selectedTags,
      tagNames,
      breathPerSession,
      currentSession
    } = this.props;
    const breathNumberItems = currentSession.breathCount ? AdditionBreathNumbers : BreathNumbers;
        
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.leftIconContainer}
            onPress={this.goHome}>
            <Image source={leftArrowIcon} style={styles.leftIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.pickersContainer}>
          <Text style={styles.title}>Breaths</Text>

          <View style={styles.dropDownContainer}>
            <Text style={styles.subTitle}>Number</Text>
            <View style={styles.pickerHolder}>
              <RNPickerSelect
                onValueChange={this.setBreathNumber}
                style={placeHolderStyle}
                placeholder={defaultPlaceHolder}
                items={breathNumberItems}
                value={this.state.breathValue}
                useNativeAndroidPickerStyle={false}       
                onDonePress={this.handleDonePressBreathValuePicker}  
                  
              />
              <Image
                source={downArrowIcon}
                style={styles.downIcon}
                pointerEvents="none"
              />
            </View>
          </View>

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
              <Image
                source={downArrowIcon}
                style={styles.downIcon}
                pointerEvents="none"
              />
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
              <Image
                source={downArrowIcon}
                style={styles.downIcon}
                pointerEvents="none"
              />
            </View>
          </View>
        </View>
        <View style={styles.tilesContainer}>
          <Text style={[styles.title, {paddingLeft: 25}]}>Meditations</Text>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {tagNames.map((item) => (
              <Tag
                item={item}
                key={item.id}
                selectedTags={selectedTags}
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
  const {settings, tagNames,currentSession} = state;

  const {inhaleTime, exhaleTime, selectedTags, breathPerSession} = settings;
  return {
    inhaleTime,
    exhaleTime,
    tagNames,
    selectedTags,
    currentSession,
    breathPerSession,
  };
};

export default connect(mapStateToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1f37',
  },
  backButtonContainer: {
    height: 100,
    justifyContent: 'center',
  },
  leftIconContainer: {
    height: 50,
    width: 50,
    left: 25,
    justifyContent: 'center',
  },
  leftIcon: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  downIcon: {
    alignSelf: 'center',
    height: 30,
    width: 30,
    marginLeft: -50,
  },
  pickersContainer: {
    flex: 2,
    paddingLeft: 20,
  },
  switchStyle: {
    ...Platform.select({
      android: {
        transform: [{scaleX: 1.3}, {scaleY: 1.3}],
      },
    }),
  },
  tilesContainer: {
    flex: 3,
    // padding:20,
  },
  title: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 28,
  },
  dropDownContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 30,
  },
  pickerHolder: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
  },
  switchHolder: {
    flex: 1,
    marginLeft: 30,
    flexDirection: 'row',
  },
  scrollView: {
    marginTop: 10,
    flexGrow: 1,
    marginLeft: 30,
  },
  subTitle: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
  },
});
