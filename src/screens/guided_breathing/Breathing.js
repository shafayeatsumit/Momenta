import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Dimensions,
  Platform,
  Easing,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './Breathing.styles';
import LottieView from 'lottie-react-native';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
const INITIAL_MESSAGE = 'Tap and hold when ready to inhale';
import {connect} from 'react-redux';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';

const {width} = Dimensions.get('window');
const size = width - 50;
const strokeWidth = 20;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

class Breathing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <View style={styles.container} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    courses: state.courses,
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(Breathing);
