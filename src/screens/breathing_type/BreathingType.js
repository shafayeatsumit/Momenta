import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './BreathingType.styles';
import Settings from './Settings';
import BackButton from '../../../assets/icons/arrow_left.png';
import RightArrow from '../../../assets/icons/arrow_right.png';
import analytics from '@react-native-firebase/analytics';

class BreathingType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsVisible: false,
      settingsType: null,
    };
  }

  handleTimeSelect = (breathingTime) => {
    const {dispatch, breathing} = this.props;
    if (breathing.type === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TIME', breathingTime});
    } else {
      dispatch({type: 'SELECT_FIXED_TIME', breathingTime});
    }
    this.setState({showBreathingTime: false});
    analytics().logEvent('button_push', {title: `duration_${breathingTime}`});
  };

  goBack = () => {
    this.props.navigation.goBack();
    analytics().logEvent('button_push', {title: 'backto_thumbnails'});
  };

  showSoundSettings = () =>
    this.setState({
      settingsVisible: true,
      settingsType: 'sound',
    });

  showDurationSettings = () =>
    this.setState({
      settingsVisible: true,
      settingsType: 'duration',
    });

  hideSettings = () => this.setState({settingsVisible: false});

  handleStart = () => {
    const {breathing, navigation, userInfo} = this.props;
    analytics().logEvent('button_push', {title: 'Start'});
    if (!userInfo.onboarded) {
      const breathingType =
        breathing.type === 'fixed' ? 'FixedBreathing' : 'GuidedBreathing';
      navigation.navigate('CheckinTutorial', {
        navRoute: breathingType,
      });
      return;
    }
    breathing.type === 'fixed'
      ? navigation.navigate('FixedBreathing')
      : navigation.navigate('GuidedBreathing');
  };

  render() {
    const {settingsVisible, settingsType} = this.state;
    const {breathing, sound} = this.props;
    const {breathingType} = this.props.route.params;
    const {background} = breathingType;
    const minOrMins = breathing.breathingTime > 1 ? 'mins' : 'min';
    if (settingsVisible) {
      return (
        <Settings
          type={settingsType}
          goBack={this.hideSettings}
          sound={sound}
        />
      );
    }
    return (
      <ImageBackground source={background} style={styles.background}>
        <View style={styles.titleBox}>
          <Text style={styles.titleSm}>{breathing.name_line_one}</Text>
          <Text style={styles.title}>{breathing.name_line_two}</Text>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{breathing.description}</Text>
        </View>
        <TouchableOpacity style={styles.backbuttonHolder} onPress={this.goBack}>
          <Image source={BackButton} style={styles.backbutton} />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonTransparent]}
            onPress={this.showDurationSettings}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Duration</Text>
            <View>
              <Text style={styles.buttonTextRight}>
                {breathing.breathingTime} {minOrMins}
              </Text>
              {breathing.breathingTime === breathing.recommendedTime && (
                <Text style={[styles.buttonTextRight, {fontSize: 8}]}>
                  Recommended
                </Text>
              )}
            </View>
            <Image style={styles.rightButton} source={RightArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.showSoundSettings}
            style={[styles.button, styles.buttonTransparent]}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Sound</Text>
            <Text style={styles.buttonTextRight}>{sound.name}</Text>
            <Image style={styles.rightButton} source={RightArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={this.handleStart}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    breathing: state.breathing,
    userInfo: state.userInfo,
    sound: state.sound,
  };
};

export default connect(mapStateToProps)(BreathingType);
