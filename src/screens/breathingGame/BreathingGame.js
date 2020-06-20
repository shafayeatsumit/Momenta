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
import analytics from '@react-native-firebase/analytics';

import styles from './BreathingGame.styles';
import GameExplainer from './GameExplainerModal';
import tapIcon from '../../../assets/icons/tapIcon.png';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DEFAULT_DURATION = 4000;
const ExhaleDuration = 4;
const DURATION_PER_UNIT = DEFAULT_DURATION / 4; // from radius 1 to 7 = 6 unit
const EXPAND_DURATION = DURATION_PER_UNIT;
const HELPER_MESSAGE = 'Hold to inhale and release \n after 4 seconds';
const DELAY_MESSAGE = 'Inhale for 4 seconds';
class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: true,
      modalVisible: false,
      showHelperIcon: false,
      successMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
    };
    this.radius = new Animated.Value(3);
    this.imageOpacity = new Animated.Value(1);
    this.pressInTime = null;
    // all the timers
    this.idleTimerId = null;
    this.explainerModalId = null;
    this.hlperMessageId = null;
    this.helperIconId = null;
    this.exhaleTimerId = null;
    this.inhaleTimerId = null;
    this.startExhaleTimerId = null;
    this.closeModalId = null;
  }

  expandCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (7 - currentRadius) * EXPAND_DURATION;
    Animated.parallel([
      Animated.timing(this.radius, {
        toValue: 7,
        duration: duration,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(this.imageOpacity, {
        toValue: 0.4,
        duration: duration,
        useNativeDriver: true,        
      })

    ]).start()
  };

  startExhaleTimer = () => {
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 0) {
        clearInterval(this.exhaleTimerId);
        this.setState({exhaleTimer: 0});
        return;
      }
      this.setState((prevState) => ({
        exhaleTimer: prevState.exhaleTimer - 1,
        ...(prevState.exhaleTimer === 1 && {
          touchDisabled: false,
          // show the second helper msg when the touch is re-enabled
          successMessage: DELAY_MESSAGE,
          showHelperIcon: true,
        }),
      }));
    }, 1000);
  };

  startInhaleTimer = () => {
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
    const fullScreenRevealed = radiusValue === 7;
    // we need to show
    let message = '';
    let roundedtimeDiff = timeDiff.toFixed(1);
    if (timeDiff < 2 && !fullScreenRevealed) {
      this.setState({successMessage: HELPER_MESSAGE, touchDisabled: false});
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

    if (fullScreenRevealed) {
      this.setState({touchDisabled: true});
      this.showFullScreen(message);
      return;
    }
    this.setState({
      successMessage: message,
      touchDisabled: true,
    });

    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);

    this.startExhaleTimerId = setTimeout(() => {
      this.setState(
        {successMessage: false, exhaleTimer: ExhaleDuration},
        this.startExhaleTimer,
      );
    }, 1000);
  };

  handlePressOut = () => {
    Animated.timing(this.radius).stop();
    const timeDiff = (new Date() - this.pressInTime) / 1000;
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);

    clearInterval(this.inhaleTimerId);
    this.startExhale(timeDiff);
  };

  handlePressIn = () => {
    const {showHelperIcon} = this.state;
    showHelperIcon && this.setState({showHelperIcon: false});
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
        this.setState({successMessage: HELPER_MESSAGE, touchDisabled: false}),
      600,
    );
    this.showHelperIcon();
  };

  showHelperIcon = () => {
    this.helperIconId = setTimeout(
      () => this.setState({showHelperIcon: true}),
      1500,
    );
  };

  componentDidMount() {
    const {firstLaunch} = this.props;
    firstLaunch.playCount === 0
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
  }

  render() {
    const {
      exhaleTimer,
      successMessage,
      touchDisabled,
      inhaleTimer,
      showHelperIcon,
      modalVisible,
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
        {modalVisible && <GameExplainer closeExplainer={this.closeExplainer} />}
        <Animated.Image source={this.props.backgroundImage} blurRadius={50} style={[styles.container, {opacity:this.imageOpacity}]}/>
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
        ) : null}
        {successMessage ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {showHelperIcon ? (
          <View style={styles.tapIconHolder} pointerEvents="none">
            <Image source={tapIcon} style={styles.tapIcon} />
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
