import React, {Component} from 'react';
import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styles from './FixedBreathing.styles';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import BreathingProgress from './BreathingProgress';
import {connect} from 'react-redux';

class FixedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleText: 'Tap Anywhere To Start',
      finished: false,
    };
    this.animated = new Animated.Value(0);
    this.counter = 0;
    this.totalBreaths = props.fixedBreathing.numberOfBreaths;
    this.inhaleTime = props.fixedBreathing.inhale;
    this.inhaleHold = props.fixedBreathing.inhaleHold;
    this.exhaleTime = props.fixedBreathing.exhale;
    this.exhaleHold = props.fixedBreathing.exhaleHold;
    this.totalTime =
      this.inhaleTime + this.exhaleTime + this.inhaleHold + this.exhaleHold;
  }

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    console.log('hapticfeedbak');
  };

  startInhaleHoldTimer = () => {
    this.inhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold!'});
      this.startHapticFeedback();
      clearTimeout(this.inhaleHoldTimer);
    }, this.inhaleTime * 1000);
  };

  startExhaleTimer = () => {
    this.exhaleTimer = setTimeout(() => {
      this.setState({circleText: 'Exhale'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleTimer);
    }, (this.inhaleTime + this.inhaleHold) * 1000);
  };

  startExhaleHoldTimer = () => {
    this.exhaleHoldTimer = setTimeout(() => {
      this.setState({circleText: 'Hold!'});
      this.startHapticFeedback();
      clearTimeout(this.exhaleHoldTimer);
    }, (this.totalTime - this.exhaleHold) * 1000);
  };

  animatCb = () => {
    this.counter += 1;
    console.log('total breaths', this.totalBreaths, this.counter);
    if (this.totalBreaths > this.counter) {
      this.animate();
      this.inhaleStart();
      this.startExhaleTimer();
      this.inhaleHold && this.startInhaleHoldTimer();
      this.exhaleHold && this.startExhaleHoldTimer();
    } else {
      this.setState({finished: true});
    }
  };

  animate = () => {
    this.animated.setValue(0);
    Animated.timing(this.animated, {
      toValue: 1,
      duration: this.totalTime * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(this.animatCb);
  };

  inhaleStart = () => {
    this.setState({circleText: 'Inhale'});
    this.startHapticFeedback();
  };

  handlePress = () => {
    this.inhaleStart();
    this.startExhaleTimer();
    this.exhaleHold && this.startExhaleHoldTimer();
    this.inhaleHold && this.startInhaleHoldTimer();
    this.animate();
  };

  componentWillUnmount() {
    this.inhaleHoldTimer && clearTimeout(this.inhaleHoldTimer);
    this.exhaleHoldTimer && clearTimeout(this.exhaleHoldTimer);
    this.exhaleTimer && clearTimeout(this.exhaleTimer);
  }

  render() {
    const inputRange = [0, 1];
    const outputRange = ['0deg', '360deg'];
    this.rotate = this.animated.interpolate({inputRange, outputRange});
    const {circleText, finished} = this.state;
    const transform = [{rotate: this.rotate}];
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={this.handlePress}>
        <BreathingProgress
          inhaleTime={this.inhaleTime}
          exhaleTime={this.exhaleTime}
          inhaleHold={this.inhaleHold}
          exhaleHold={this.exhaleHold}
        />
        <View style={styles.boxContainer}>
          <Animated.View style={[styles.box, {transform: transform}]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{circleText}</Text>
        </View>
        {finished && (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.text}>Finish</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    fixedBreathing: state.fixedBreathing,
  };
};

export default connect(mapStateToProps)(FixedBreathing);
