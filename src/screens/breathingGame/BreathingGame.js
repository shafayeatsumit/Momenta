import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';
import {connect} from 'react-redux';
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';

import styles from './BreathingGame.styles';
import GameExplainer from './GameExplainerModal';
import tapIcon from '../../../assets/icons/inhale_again_helper.png';
import tapIconFirstTimer from '../../../assets/icons/inhale_helper_first_timer.png';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SMOOTH_WORDS = [
  'Slowly',
  'Gently',
  'Softly',
  'Quietly',
  'Smoothly',
  'Lightly',
];
const START_RADIUS = {
  3: 4,
  4: 3,
  5: 2,
  6: 1,
};

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: true,
      modalVisible: false,
      showHelperIcon: false,
      pressIn: false,
      successMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
      smoothWord: null,
    };
    this.startRadius = START_RADIUS[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
    this.pressInTime = null;
    // messages
    this.helperMessage = `Hold to inhale and release \n after ${props.settings.inhaleTime} seconds`;
    this.delayMessage = `Inhale for ${props.settings.inhaleTime} seconds`;

    // all the timers
    this.idleTimerId = null;
    this.explainerModalId = null;
    this.hlperMessageId = null;
    this.helperIconId = null;
    this.exhaleTimerId = null;
    this.inhaleTimerId = null;
    this.startExhaleTimerId = null;
    this.closeModalId = null;
    this.fullScreenId = null;
  }

  expandCircle = () => {
    const {inhaleTime} = this.props.settings;
    const duration = inhaleTime * 1000;
    Animated.timing(this.radius, {
      toValue: 7,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  shrinkCircle = () => {
    this.setState({touchDisabled: true});
    Animated.timing(this.radius, {
      toValue: 3,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.setState({
        touchDisabled: false,
        successMessage: this.delayMessage,
        showHelperIcon: true,
        pressIn: false,
      });
    });
  };

  startExhaleTimer = (fullScreen) => {
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 0) {
        clearInterval(this.exhaleTimerId);
        this.setState({exhaleTimer: 0});
        fullScreen && this.props.closeBreathingGame();
        return;
      }
      this.setState((prevState) => ({
        exhaleTimer: prevState.exhaleTimer - 1,
        ...(prevState.exhaleTimer === 1 &&
          !fullScreen && {
            touchDisabled: false,
            // show the second helper msg when the touch is re-enabled
            successMessage: this.delayMessage,
            showHelperIcon: true,
          }),
      }));
    }, 1000);
  };

  startInhaleTimer = () => {
    const smoothWord = _.sample(SMOOTH_WORDS);
    this.setState({smoothWord});
    this.inhaleTimerId = setInterval(() => {
      this.setState((prevState) => ({
        successMessage: '',
        inhaleTimer: prevState.inhaleTimer + 1,
      }));
    }, 1000);
  };

  showFullScreen = (message) => {
    this.setState({successMessage: message});
    this.closeModalId = setTimeout(() => {
      this.props.closeBreathingGame();
    }, 1500);
  };

  startExhale = (timeDiff) => {
    const radiusValue = this.radius._value;
    // 6.8 instead of 7. because, we don't want user to take  another 4sec breath if the image is almost revealed.
    const fullScreenRevealed = radiusValue > 6.8;
    let message = '';
    let roundedtimeDiff = timeDiff.toFixed(1);
    if (timeDiff < 2 && !fullScreenRevealed) {
      this.setState({successMessage: this.helperMessage, touchDisabled: false});
      return;
    }

    if (timeDiff < 2 && fullScreenRevealed) {
      this.setState({touchDisabled: true});
      this.showFullScreen();
    } else if (timeDiff > 2 && timeDiff < 3) {
      message = `Almost ${roundedtimeDiff}`;
    } else if (timeDiff > 3 && timeDiff < 3.5) {
      message = `Good ${roundedtimeDiff}`;
    } else if (timeDiff > 3.5 && timeDiff < 3.8) {
      message = `Great ${roundedtimeDiff}`;
    } else if (timeDiff > 3.8 && timeDiff < 4.2) {
      message = `Perfect ${roundedtimeDiff}`;
    } else if (timeDiff > 4.2 && timeDiff < 4.5) {
      message = `Great ${roundedtimeDiff}`;
    } else if (timeDiff > 4.5 && timeDiff < 5) {
      message = `Good ${roundedtimeDiff}`;
    } else {
      message = `Almost ${roundedtimeDiff}`;
    }

    this.setState({
      successMessage: message,
      touchDisabled: true,
    });
    const {exhaleTime} = this.props.settings;
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.startExhaleTimerId = setTimeout(() => {
      this.setState({successMessage: false, exhaleTimer: exhaleTime}, () => {
        fullScreenRevealed
          ? this.startExhaleTimer(true)
          : this.startExhaleTimer();
      });
    }, 1000);
  };

  handlePressOut = () => {
    const {inhaleTime} = this.props.settings;
    Animated.timing(this.radius).stop();
    const timeDiffInMs = new Date() - this.pressInTime;
    const timeDiff = timeDiffInMs / 1000;
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);

    clearInterval(this.inhaleTimerId);
    if (timeDiff < inhaleTime) {
      this.shrinkCircle();
    } else {
      this.startExhale(timeDiff);
    }
  };

  handlePressIn = () => {
    this.setState({pressIn: true});
    this.pressInTime = new Date();
    this.startInhaleTimer();
    this.expandCircle();
  };

  showGameExplainerModal = () => {
    this.explainerModalId = setTimeout(
      () => this.setState({modalVisible: true}),
      1200,
    );
  };

  closeExplainer = () => {
    this.setState({modalVisible: false});
    this.showHelpers();
    clearTimeout(this.explainerModalId);
  };

  showHelpers = () => {
    this.hlperMessageId = setTimeout(
      () =>
        this.setState({
          successMessage: this.helperMessage,
          touchDisabled: false,
        }),
      600,
    );
    this.showHelperIcon();
  };

  showHelperIcon = () => {
    this.helperIconId = setTimeout(
      () => this.setState({showHelperIcon: true}),
      1300,
    );
  };

  componentDidMount() {
    const {firstLaunch} = this.props;
    firstLaunch.playCount === 1
      ? this.showGameExplainerModal()
      : this.showHelpers();

    this.animationId = this.radius.addListener(({value}) => {});
  }

  componentWillUnmount() {
    this.animationId && this.radius.removeListener(this.animationId);
    this.idleTimerId && clearTimeout(this.inhaleTimerId);
    this.explainerModalId && clearTimeout(this.explainerModalId);
    this.hlperMessageId && clearTimeout(this.hlperMessageId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.exhaleTimerId && clearInterval(this.exhaleTimerId);
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.closeModalId && clearTimeout(this.closeModalId);
    this.fullScreenId && clearTimeout(this.fullScreenId);
  }

  render() {
    const {
      exhaleTimer,
      successMessage,
      touchDisabled,
      inhaleTimer,
      showHelperIcon,
      modalVisible,
      pressIn,
      smoothWord,
    } = this.state;
    const {firstLaunch} = this.props;
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const helperIcon = firstLaunch.playCount > 1 ? tapIcon : tapIconFirstTimer;

    return (
      <View style={styles.container}>
        {modalVisible && <GameExplainer closeExplainer={this.closeExplainer} />}
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
            <Text
              style={
                styles.successText
              }>{`Inhale ${smoothWord} \n ${inhaleTimer}`}</Text>
          </View>
        ) : null}

        {exhaleTimer ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text
              style={
                styles.successText
              }>{`Exhale ${smoothWord} \n ${exhaleTimer}`}</Text>
          </View>
        ) : null}
        {successMessage ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {showHelperIcon && !pressIn ? (
          <View style={styles.tapIconHolder} pointerEvents="none">
            <Image source={helperIcon} style={styles.tapIcon} />
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
  const {firstLaunch, settings} = state;
  return {
    firstLaunch,
    settings,
  };
};

export default connect(mapStateToProps)(BreathingGame);
