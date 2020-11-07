import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Easing,
  Image,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';

import styles from './BreathingGame.styles';
import BreathingGameCircle from './BreathingGameCircle';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import ProgressTracker from '../../components/ProgressTracker';
import ExerciseSettings from '../ExerciseSettings';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      breathingType: 'exhale',
      timeIsUp: false,
    };
    const {breathingTime} = props.guidedBreathing;
    this.finishDuration = breathingTime * 60;
    this.breathTaken = 0;
    this.unmounted = false;
    this.animatedProgress = new Animated.Value(0);
  }

  startStopWatch = () => {
    this.stopWatchId = setInterval(() => {
      const {timer} = this.state;
      const timeIsUp = timer === this.finishDuration;
      if (timeIsUp) {
        clearInterval(this.stopWatchId);
        this.setState({timeIsUp: true});
        return;
      }
      this.setState({timer: timer + 1});
    }, 1000);
  };

  componentDidMount() {
    this.startStopWatch();
  }

  componentWillUnmount() {
    clearInterval(this.stopWatchId);
  }

  render() {
    const {timer} = this.state;
    return (
      <View style={{flex: 1}}>
        <ProgressTracker
          currentTime={timer}
          targetTime={this.finishDuration}
          showTimer={true}
          close={this.props.handleQuit}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
          }}>
          <ExerciseSettings />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(BreathingGame);
