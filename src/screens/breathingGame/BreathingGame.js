import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  Modal,
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

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SMOOTH_WORDS = [
  'Slowly',
  'Gently',
  'Softly',
  'Quietly',
  'Smoothly',
  'Lightly',
];
// inhaletime to radius
const START_RADIUSES = {
  3: 4,
  4: 3,
  5: 2,
  6: 1,
};

const RELEASE_MESSAGE = 'Release just after image is revealed';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: false,
      showTapAnimation: false,
      successMessage: '',
      progressVisible: true,
      introModalVisible: false,
    };

    this.startRadius = START_RADIUSES[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
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
        successMessage: '',
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
      successMessage: 'Almost, give it another shot',
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

  startExhale = () => {
    this.props.imageFadeOut();

    this.setState({
      successMessage: `Exhale ${this.smoothWord}`,
      ...(this.state.showTapAnimation && {showTapAnimation: false}),
    });
  };

  startInhale = () => {
    const {settings} = this.props;
    const smoothWord = _.sample(SMOOTH_WORDS);
    this.smoothWord = smoothWord;
    this.setState({successMessage: `Inhale ${smoothWord}`});
    const duration = settings.inhaleTime * 1000;
    this.clearInhaleId = setTimeout(() => {
      this.setState({successMessage: ''});
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
    ReactNativeHapticFeedback.trigger('selection', hapticFeedbackOptions);
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

  showSettingsMenu = (time) => {
    const duration = time || 500;
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
    analytics().logEvent('viewed_settings');
  };

  showReleaseMessage = () => {
    this.releaseMessageId = setTimeout(() => {
      const {pressInParent} = this.props;
      if (pressInParent) {
        this.setState({successMessage: RELEASE_MESSAGE});
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
      successMessage,
      showTapAnimation,
      settingsMenuVisible,
      touchDisabled,
      progressVisible,
      introModalVisible,
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
            <Text style={styles.progressText}>{this.getProgress()}</Text>
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

        {successMessage ? (
          <View style={styles.textWrapper}>
            <View style={styles.successTextContainer} pointerEvents="none">
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
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
