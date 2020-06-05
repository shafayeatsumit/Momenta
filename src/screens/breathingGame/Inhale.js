import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {ScreenHeight} from '../../helpers/constants/common';
import downIcon from '../../../assets/icons/down.png';
import tapIcon from '../../../assets/icons/tapIcon.png';

import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';
import {connect} from 'react-redux';
import GameExplainer from './ExplainerModal';
import styles from './BreathingGame.styles';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DEFAULT_DURATION = 7500;
const DURATION_PER_UNIT = DEFAULT_DURATION / 6;
const EXPAND_DURATION = DURATION_PER_UNIT;
const SHRINK_DURATION = DURATION_PER_UNIT;

const FOUR_SECONDS_EXPAND = 4000 / DURATION_PER_UNIT;

const DEFAULT_HELPER_MESSAGE = 'Inhale for 4 seconds without the target';

class Inhale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successMessage: '',
      touchDisabled: false,
      breathCompleted: 0,
      helperMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
    };
    this.radius = new Animated.Value(1);
    // all the timers
    this.pressInTime = null;
    this.helperTextTimerId = null;
    this.clearSuccessMessageId = null;
    this.closeModalId = null;
    this.tryAgainMessageId = null;
  }

  expandCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (7 - currentRadius) * EXPAND_DURATION;
    Animated.timing(this.radius, {
      toValue: 7,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  shrinkCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (currentRadius - 1) * SHRINK_DURATION;
    Animated.timing(this.radius, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  handlePressIn = () => {
    this.pressInTime = new Date();
    this.setState({successMessage: 'Inhale'});
    this.expandCircle();
  };

  handlePressOut = () => {
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.setState({inhaleTimer: 0});
    // time diff callculation margin of error 0.6
    const totalTime = (new Date() - this.pressInTime) / 1000;
    const radiusValue = this.radius._value;
    Animated.timing(this.radius).stop();
    this.setSuccessMessage(totalTime, radiusValue);
  };

  componentWillUnmount() {
    if (this.animationId) {
      this.radius.removeListener(this.animationId);
    }
  }

  startExhaleTimer = () => {
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 0) {
        clearInterval(this.exhaleTimerId);
        this.setState({exhaleTimer: 0});
        return;
      }
      this.setState((prevState) => ({
        exhaleTimer: prevState.exhaleTimer - 1,
        ...(prevState.exhaleTimer === 1 && {touchDisabled: false}),
      }));
    }, 1000);
  };

  showFullScreen = () => {
    this.closeModalId = setTimeout(this.props.closeModal, 1500);
  };

  clearTryAgain = () => {
    this.tryAgainMessageId = setTimeout(
      () =>
        this.setState({
          helperMessage: DEFAULT_HELPER_MESSAGE,
        }),
      2000,
    );
  };

  setSuccessMessage = (breathingTime, radiusValue) => {
    const fullScreenRevealed = radiusValue === 7;
    let message = '';
    let roundedBreathingTime = breathingTime.toFixed(1);

    if (breathingTime < 2 && fullScreenRevealed) {
      this.setState({touchDisabled: true});
      this.showFullScreen();
    } else if (breathingTime < 2) {
      message = 'Try again when ready';
      this.setState({helperMessage: message}, this.clearTryAgain);
      return;
    } else if (breathingTime > 2 && breathingTime < 3) {
      message = `Almost ${roundedBreathingTime}`;
    } else if (breathingTime > 3 && breathingTime < 3.5) {
      message = `Good ${roundedBreathingTime}`;
    } else if (breathingTime > 3.5 && breathingTime < 3.8) {
      message = `Great ${roundedBreathingTime}`;
    } else if (breathingTime > 3.8 && breathingTime < 4.2) {
      message = `Perfect ${roundedBreathingTime}`;
    } else if (breathingTime > 4.2 && breathingTime < 4.5) {
      message = `Great ${roundedBreathingTime}`;
    } else if (breathingTime > 4.5 && breathingTime < 5) {
      message = `Good ${roundedBreathingTime}`;
    } else {
      message = `Almost ${roundedBreathingTime}`;
    }

    if (fullScreenRevealed) {
      this.setState({successMessage: message, touchDisabled: true});
      this.showFullScreen();
      return;
    }

    this.setState({
      successMessage: message,
      touchDisabled: true,
    });
    setTimeout(
      () =>
        this.setState(
          {
            successMessage: false,
            exhaleTimer: Math.ceil(breathingTime),
          },
          this.startExhaleTimer,
        ),
      1000,
    );
  };

  showHelperText() {
    setTimeout(
      () => this.setState({helperMessage: DEFAULT_HELPER_MESSAGE}),
      600,
    );
  }

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {});
    this.showHelperText();
  }

  render() {
    const {contentTag} = this.props;
    const {
      helperMessage,
      exhaleTimer,
      successMessage,
      touchDisabled,
      inhaleTimer,
    } = this.state;
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '70%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';

    return (
      <View style={styles.container}>
        <View style={styles.categoryHolder}>
          <Text style={styles.category}>{contentTag}</Text>
        </View>

        <TouchableOpacity onPress={this.props.minimize} style={styles.iconDown}>
          <Image source={downIcon} style={styles.iconStyle} />
        </TouchableOpacity>

        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect height="100%" width="100%" fill={reactFillColor} />
              <AnimatedCircle
                r={radiusPercent}
                cx="50%"
                cy="50%"
                strokeWidth="1"
                fill={circleFillColor}
              />
            </Mask>
          </Defs>
          <Rect
            height="100%"
            width="100%"
            fill="#1b1f37"
            mask="url(#mask)"
            fill-opacity="0"
          />
        </Svg>
        {inhaleTimer ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{`Inhale \n ${inhaleTimer}`}</Text>
          </View>
        ) : null}
        {exhaleTimer ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{`Exhale \n ${exhaleTimer}`}</Text>
          </View>
        ) : (
          <View style={styles.helperTextContainer} pointerEvents="none">
            <Text style={styles.helperText}>{helperMessage}</Text>
          </View>
        )}
        {successMessage ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          disabled={touchDisabled}
          style={styles.tapArea}
          activeOpacity={1}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {firstLaunch} = state;
  const {breathingGamePlayed, viewedGameExplainer} = firstLaunch;
  return {
    playingFirstTime: breathingGamePlayed,
    viewedGameExplainer,
  };
};

export default connect(mapStateToProps)(Inhale);
