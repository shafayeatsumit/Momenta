import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  Modal,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';
import {connect} from 'react-redux';
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';
import styles from './BreathingGame.styles';
import IntroModal from './IntroModal';
import arrowRightIcon from '../../../assets/icons/menu.png';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  SMOOTH_WORDS,
  EXHALE_MESSAGE,
  START_RADIUSES,
  hapticFeedbackOptions,
  RELEASE_MESSAGE,
  RANDOMNESS,
} from '../../helpers/constants/common';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: false,
      showTapAnimation: false,
      breathingMessage: '',
      progressVisible: true,
      introModalVisible: false,
    };

    this.startRadius = START_RADIUSES[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
    this.breathingTextOpacity = new Animated.Value(1);
    this.smoothWord = null;
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

  shrinkCircleCb = () => {
    const {pressInParent, onboarding} = this.props;
    this.setState(
      {
        breathCountVisible: true,
        breathingMessage: '',
        touchDisabled: false,
        progressVisible: true,
        settingsMenuVisible: true,
      },
      () => {
        pressInParent && this.handlePressIn();
        onboarding.breathingTutorial && this.setState({showTapAnimation: true});
      },
    );
  };

  shrinkCircle = () => {
    this.setState({
      breathingMessage: 'Almost, give it another shot',
      showTapAnimation: false,
      settingsMenuVisible: false,
      touchDisabled: true,
    });
    Animated.timing(this.radius, {
      toValue: this.startRadius,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(this.shrinkCircleCb);
  };

  fadeInExhaleMessage = () => {
    Animated.timing(this.breathingTextOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 0,
      useNativeDriver: true,
    }).start(this.fadeOutExhaleMessage);
  };

  fadeOutExhaleMessage = () => {
    const {settings} = this.props;
    const exhaleTime = settings.exhaleTime * 1000;
    const fadeInDuration = 1000;
    const fadeInDelay = 0;
    const fadeInTime = fadeInDuration + fadeInDelay;
    const fadeOutDuration = 500;
    const delayDuration = exhaleTime - fadeInTime - fadeOutDuration;
    Animated.timing(this.breathingTextOpacity, {
      toValue: 0,
      duration: fadeOutDuration,
      delay: delayDuration,
      useNativeDriver: true,
    }).start();
  };

  startExhale = () => {
    this.props.imageFadeOut();
    const {currentSession, onboarding} = this.props;
    const randomMessage = _.sample(EXHALE_MESSAGE);
    const showRandomMessage = _.sample(RANDOMNESS);
    const firstBreathOfTheSession = currentSession.breathCount === 1;
    const showInstruction =
      onboarding.breathingTutorial || firstBreathOfTheSession;
    if (showInstruction) {
      this.setState({
        breathingMessage: `Exhale ${this.smoothWord}`,
        showTextOverlay: false,
        ...(this.state.showTapAnimation && {showTapAnimation: false}),
      });
    } else {
      this.breathingTextOpacity.setValue(0);
      showRandomMessage &&
        this.setState({
          breathingMessage: randomMessage,
          showTextOverlay: false,
        });
      this.fadeInExhaleMessage();
    }
  };

  startInhale = () => {
    const {settings, onboarding, currentSession} = this.props;
    const smoothWord = _.sample(SMOOTH_WORDS);
    this.smoothWord = smoothWord;
    const firstBreathOfTheSession = currentSession.breathCount === 0;
    const showInstruction =
      onboarding.breathingTutorial || firstBreathOfTheSession;
    showInstruction &&
      this.setState({
        breathingMessage: `Inhale ${smoothWord}`,
        showTextOverlay: true,
      });
    const duration = settings.inhaleTime * 1000;
    this.clearInhaleId = setTimeout(() => {
      onboarding.breathingTutorial && this.setState({breathingMessage: ''});
      clearTimeout(this.clearInhaleId);
    }, duration);
  };

  handlePressOut = () => {
    if (this.state.touchDisabled) {
      return;
    }

    const radiusValue = this.radius._value;
    const fullScreenRevealed = radiusValue === 7;
    Animated.timing(this.radius).stop();
    // clearing inhale timer
    this.inhaleTimerId && clearTimeout(this.inhaleTimerId);
    if (fullScreenRevealed) {
      this.startExhale();
      this.setState({touchDisabled: true});
    } else {
      this.shrinkCircle();
    }
  };

  startHapticFeedback = () => {
    const feedbackType = Platform.OS === 'ios' ? 'selection' : 'clockTick';
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  handlePressIn = () => {
    if (this.state.touchDisabled) {
      return;
    }
    this.startInhale();
    this.expandCircle();
  };

  setStartRadius = (inhaleTime) => {
    this.startRadius = START_RADIUSES[inhaleTime];
    this.radius.setValue(this.startRadius);
  };

  showSettingsMenu = () => {
    const {breathCount} = this.props.currentSession;
    const duration = breathCount === 0 ? 0 : 2500;
    this.helperIconId = setTimeout(() => {
      const {onboarding} = this.props;
      onboarding.completed && this.setState({settingsMenuVisible: true});
    }, duration);
  };

  closeIntroModal = () =>
    this.setState({introModalVisible: false}, this.showPressInAnimation);

  showIntroModal = () => {
    this.setState({touchDisabled: true});
    this.intromodalId = setTimeout(() => {
      this.setState({introModalVisible: true, touchDisabled: false});
      clearTimeout(this.intromodalId);
    }, 1500);
  };

  showPressInAnimation = () => this.setState({showTapAnimation: true});

  showHelpers = () => {
    const {onboarding} = this.props;
    if (!onboarding.breathingTutorial) {
      this.showSettingsMenu();
      return;
    }
    const {breathCount} = onboarding;
    breathCount === 0 ? this.showIntroModal() : this.showPressInAnimation();
  };

  handleArrowPresss = () => {
    const {navigation} = this.props;
    navigation.navigate('Settings');
    analytics().logEvent('button_push', {title: 'settings menu'});
  };

  showReleaseMessage = () => {
    this.releaseMessageId = setTimeout(() => {
      const {pressInParent} = this.props;
      if (pressInParent) {
        this.setState({breathingMessage: RELEASE_MESSAGE});
      }
      clearTimeout(this.releaseMessageId);
    }, 1000);
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    const totalBreath =
      settings.breathPerSession + currentSession.additionalBreath;
    return (
      <Text style={[styles.progressText, styles.progressTextBig]}>
        {currentSession.breathCount}
        <Text style={styles.progressText}>/{totalBreath}</Text>
      </Text>
    );
  };

  radiusListener = (value) => {
    const fullScreenRevealed = value === 7;
    const {onboarding, dispatch} = this.props;
    if (fullScreenRevealed) {
      // showPressOutAnimation helper
      this.startHapticFeedback();
      onboarding.breathingTutorial && this.showReleaseMessage();
      if (!onboarding.breathingTutorial) {
        dispatch({type: 'ADD_BREATH_COUNT'});
      } else {
        dispatch({type: 'ONBOARDING_ADD_BREATH_COUNT'});
      }
    }
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) =>
      this.radiusListener(value),
    );
    const {pressInParent} = this.props;
    pressInParent && this.handlePressIn();
    // show it for the first time.
    this.showHelpers();
  }

  componentDidUpdate(prevProps) {
    const {inhaleTime} = this.props.settings;
    const {pressInParent, pressOutParent} = this.props;
    if (prevProps.settings.inhaleTime !== inhaleTime) {
      this.setStartRadius(inhaleTime);
    }
    if (prevProps.pressInParent !== pressInParent) {
      pressInParent && this.handlePressIn();
    }
    if (prevProps.pressOutParent !== pressOutParent) {
      pressOutParent && this.handlePressOut();
    }
  }

  componentWillUnmount() {
    this.animationId && this.radius.removeListener(this.animationId);
    this.intromodalId && clearTimeout(this.intromodalId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.inhaleTimerId && clearTimeout(this.inhaleTimerId);
    this.showHelperId && clearTimeout(this.showHelperId);
    this.releaseMessageId && clearTimeout(this.releaseMessageId);
  }

  render() {
    const {
      breathingMessage,
      showTapAnimation,
      settingsMenuVisible,
      touchDisabled,
      progressVisible,
      introModalVisible,
      showTextOverlay,
    } = this.state;
    const {onboarding, pressInParent} = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const showSettingsMenu =
      onboarding.completed &&
      !pressInParent &&
      !touchDisabled &&
      settingsMenuVisible;
    return (
      <View style={styles.container}>
        {showSettingsMenu && (
          <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={this.handleArrowPresss}>
            <Image source={arrowRightIcon} style={styles.menuIcon} />
          </TouchableOpacity>
        )}
        {progressVisible && (
          <View style={styles.progressContainer} pointerEvents="none">
            <Text allowFontScaling={false} style={styles.progressText}>
              {this.getProgress()}
            </Text>
          </View>
        )}
        <Modal
          visible={introModalVisible}
          transparent={true}
          animationType="fade">
          <IntroModal closeModal={this.closeIntroModal} />
        </Modal>
        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect height="100%" width="100%" fill={'white'} />
              <AnimatedCircle
                r={radiusPercent}
                cx="50%"
                cy="50%"
                strokeWidth="1"
                fill={'black'}
              />
            </Mask>
          </Defs>

          <Rect
            height="100%"
            width="100%"
            fill="#141831"
            mask="url(#mask)"
            fill-opacity="0"
          />
        </Svg>

        {breathingMessage ? (
          <View style={styles.textWrapper}>
            <Animated.View
              style={[
                styles.breathingTextContainer,
                showTextOverlay && styles.breathingTextOverlay,
                {opacity: this.breathingTextOpacity},
              ]}
              pointerEvents="none">
              <Text allowFontScaling={false} style={styles.breathingText}>
                {breathingMessage}
              </Text>
            </Animated.View>
          </View>
        ) : null}

        {showTapAnimation && !pressInParent && (
          <View style={styles.tapIconHolder}>
            <LottieView
              autoPlay
              loop
              autoSize
              source={require('../../../assets/anims/tap.json')}
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {settings, userInfo, onboarding, currentSession, breathing} = state;
  return {
    settings,
    userInfo,
    onboarding,
    currentSession,
    breathing,
  };
};

export default connect(mapStateToProps)(BreathingGame);
