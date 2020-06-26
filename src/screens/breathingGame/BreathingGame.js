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
import arrowRightIcon from '../../../assets/icons/arrow_right.png';
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
const START_RADIUSES = {
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
    this.startRadius = START_RADIUSES[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
    this.pressInTime = null;
    // messages
    this.helperMessage = `Hold while you inhale for ${props.settings.inhaleTime} seconds`;
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
    this.setState({
      touchDisabled: true,
      successMessage: 'Almost, give it another shot',
    });
    Animated.timing(this.radius, {
      toValue: this.startRadius,
      duration: 2000,
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

  startExhaleTimer = () => {
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.props.imageFadeOut();
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 0) {
        clearInterval(this.exhaleTimerId);
        this.setState({exhaleTimer: 0});
        this.props.closeBreathingGame();
        return;
      }
      if (this.state.exhaleTimer === 1) {
        this.props.showBreathCount();
      }
      this.setState((prevState) => ({exhaleTimer: prevState.exhaleTimer - 1}));
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

  startExhale = () => {
    this.setState({touchDisabled: true});
    const {exhaleTime} = this.props.settings;
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
    this.startExhaleTimerId = setTimeout(() => {
      this.setState({successMessage: false, exhaleTimer: exhaleTime}, () => {
        this.startExhaleTimer();
      });
    }, 500);
  };

  handlePressOut = () => {
    const radiusValue = this.radius._value;
    const fullScreenRevealed = radiusValue === 7;
    Animated.timing(this.radius).stop();
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    clearInterval(this.inhaleTimerId);
    if (!fullScreenRevealed) {
      this.shrinkCircle();
    } else {
      this.startExhale();
    }
  };

  handlePressIn = () => {
    this.setState({pressIn: true});
    const {breathCountVisible, hideBreathCount} = this.props;
    breathCountVisible && hideBreathCount();
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

  setStartRadius = (inhaleTime) => {
    this.startRadius = START_RADIUSES[inhaleTime];
    this.radius.setValue(this.startRadius);
    this.helperMessage = `Hold while you inhale for ${inhaleTime} seconds`;
    this.delayMessage = `Inhale for ${inhaleTime} seconds`;
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
    firstLaunch.breathCount === 0
      ? this.showGameExplainerModal()
      : this.showHelpers();

    this.animationId = this.radius.addListener(({value}) => {});
  }

  componentDidUpdate(prevProps) {
    const {inhaleTime} = this.props.settings;
    if (prevProps.settings.inhaleTime !== inhaleTime) {
      this.setStartRadius(inhaleTime);
    }
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
    const {firstLaunch, navigation} = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const helperIcon =
      firstLaunch.breathCount > 0 ? tapIcon : tapIconFirstTimer;
    const showArrowIcon = firstLaunch.onboardingCompleted;

    return (
      <View style={styles.container}>
        {modalVisible && <GameExplainer closeExplainer={this.closeExplainer} />}
        {showArrowIcon ? (
          <TouchableOpacity
            style={styles.arrowIconContainer}
            onPress={() => navigation.navigate('Settings')}>
            <Image source={arrowRightIcon} style={styles.arrowIcon} />
          </TouchableOpacity>
        ) : null}
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
  const {firstLaunch, settings, userInfo} = state;
  return {
    firstLaunch,
    settings,
    userInfo,
  };
};

export default connect(mapStateToProps)(BreathingGame);
