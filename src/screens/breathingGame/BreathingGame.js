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
import IntroSlides from './intro_slides/IntroSlides';
import arrowRightIcon from '../../../assets/icons/arrow_right.png';
import tapIcon from '../../../assets/icons/inhale_again_helper.png';
import tapIconFirstTimer from '../../../assets/icons/inhale_helper_first_timer.png';
import {ScreenWidth} from '../../helpers/constants/common';

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

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: false,
      IntroSlidesVisible: false,
      showHelperIcon: false,
      breathCountVisible: true,
      successMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
      smoothWord: null,
    };
    this.startRadius = START_RADIUSES[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
    this.breathCountOpacity = new Animated.Value(1);
    this.pressInTime = null;
    this.releaseMsg = 'You can release the screen when image is revealed';
    // all the timers
    this.explainerModalId = null;
    this.hlperMessageId = null;
    this.helperIconId = null;
    this.exhaleTimerId = null;
    this.inhaleTimerId = null;
    this.exhaleCountDownDelayId = null;
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
      successMessage: 'Almost, give it another shot',
      showHelperIcon: false,
      showArrowIcon: false,
    });
    Animated.timing(this.radius, {
      toValue: this.startRadius,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.setState(
        {
          showHelperIcon: true,
          breathCountVisible: true,
        },
        this.showArrowIcon,
      );
    });
  };
  breathCountFadeOut = () => {
    const {settings} = this.props;
    const {exhaleTime} = settings;
    Animated.timing(this.breathCountOpacity, {
      toValue: 0,
      duration: exhaleTime * 1000,
      delay: 0,
      useNativeDriver: true,
    }).start();
  };

  exhaleCountDown = () => {
    this.props.imageFadeOut();
    this.breathCountFadeOut();
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 1) {
        clearInterval(this.exhaleTimerId);
        return;
      }
      this.setState((prevState) => ({exhaleTimer: prevState.exhaleTimer - 1}));
    }, 1000);
  };

  startExhaleCountDown = () => {
    const {settings} = this.props;
    // .5 sec dealy between inhale and exhale
    // to make it look good.
    this.exhaleCountDownDelayId = setTimeout(() => {
      clearTimeout(this.exhaleCountDownDelayId);
      this.setState(
        {successMessage: '', exhaleTimer: settings.exhaleTime},
        this.exhaleCountDown,
      );
    }, 1000);
  };

  prepareExhale = () => {
    // before starting exhaleCountdown
    // we need to clear the onscreen message.
    this.setState(
      this.setState({
        successMessage: '',
        showHelperIcon: false,
        showArrowIcon: false,
      }),
      this.startExhaleCountDown,
    );
  };

  startInhaleTimer = () => {
    const {settings} = this.props;
    const smoothWord = _.sample(SMOOTH_WORDS);
    this.setState({smoothWord});
    this.inhaleTimerId = setInterval(() => {
      this.setState((prevState) => ({
        successMessage: '',
        // inhale timer doesnt go beyond the time of inhaleTime specified in the settings
        ...(prevState.inhaleTimer < settings.inhaleTime && {
          inhaleTimer: prevState.inhaleTimer + 1,
        }),
        // breathCounter goes away after first sec
        ...(prevState.inhaleTimer === 0 && {
          breathCountVisible: false,
        }),
      }));
    }, 1000);
  };

  newUserAction = () => {
    const {userInfo, dispatch, showContent} = this.props;
    const {breathCount} = userInfo;
    if (breathCount === 4) {
      // show breathing tip;
      showContent();
      dispatch({type: 'ONBOARDING_COMPLETED'});
      dispatch({type: 'RESET_BREATH_COUNT'});
    } else {
      this.prepareExhale();
      dispatch({type: 'ADD_BREATH_COUNT'});
    }
  };

  oldUserAction = () => {
    const {dispatch, showContent, currentSession, settings} = this.props;
    const {selectedTags} = settings;
    const {breathCount} = currentSession;
    const hasSelectedTags = selectedTags.length;
    // TODO: change it later
    if (breathCount === 4) {
      hasSelectedTags ? showContent() : this.prepareExhale();
      dispatch({type: 'ADD_BREATH_COUNT'});
      dispatch({type: 'RESET_BREATH_COUNT'});
    } else {
      this.prepareExhale();
      dispatch({type: 'ADD_BREATH_COUNT'});
    }
  };

  startExhale = () => {
    const {onboardingCompleted} = this.props;
    this.setState({touchDisabled: true});
    onboardingCompleted ? this.oldUserAction() : this.newUserAction();
  };

  handlePressOut = () => {
    if (this.state.touchDisabled) {
      return;
    }

    const radiusValue = this.radius._value;
    const fullScreenRevealed = radiusValue === 7;
    Animated.timing(this.radius).stop();
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    if (fullScreenRevealed) {
      this.startExhale();
      this.setState({showArrowIcon: false});
    } else {
      this.shrinkCircle();
    }
  };

  handlePressIn = () => {
    if (this.state.touchDisabled) {
      console.log('exhale timer');
      return;
    }
    this.setState({successMessage: ''});
    this.pressInTime = new Date();
    this.startInhaleTimer();
    this.expandCircle();
  };

  showIntroSlidesModal = () => {
    this.explainerModalId = setTimeout(
      () => this.setState({IntroSlidesVisible: true}),
      800,
    );
  };

  closeExplainer = () => {
    this.setState({IntroSlidesVisible: false}, this.showHelpers);
    clearTimeout(this.explainerModalId);
  };

  setStartRadius = (inhaleTime) => {
    this.startRadius = START_RADIUSES[inhaleTime];
    this.radius.setValue(this.startRadius);
  };

  showArrowIcon = () => {
    this.helperIconId = setTimeout(
      () => this.setState({showArrowIcon: true}),
      1500,
    );
  };

  showHelpers = () => {
    this.hlperMessageId = setTimeout(() => {
      if (!this.props.pressInParent) {
        this.setState({
          showHelperIcon: true,
        });
      }
    }, 800);
    this.showArrowIcon();
  };

  getTotalBreathCount = () => {
    const {userInfo} = this.props;
    return userInfo.breathCount.toLocaleString();
  };

  handleArroPresss = () => {
    const {navigation} = this.props;
    navigation.navigate('Settings');
    analytics().logEvent('viewed_settings');
  };

  showReleaseMessage = () => {
    this.releaseMsgId = setTimeout(() => {
      this.props.pressInParent &&
        this.setState({successMessage: this.releaseMsg});
      clearTimeout(this.releaseMsgId);
    }, 1500);
  };
  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const fullScreenRevealed = value === 7;
      if (fullScreenRevealed) {
        clearInterval(this.inhaleTimerId);
        this.setState({inhaleTimer: 0});
        this.showReleaseMessage();
      }
    });
    const {pressInParent, userInfo} = this.props;
    pressInParent && this.handlePressIn();
    // show it for the first time.
    if (userInfo.breathCount) {
      this.showHelpers();
    } else {
      this.showIntroSlidesModal();
    }
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
    this.explainerModalId && clearTimeout(this.explainerModalId);
    this.hlperMessageId && clearTimeout(this.hlperMessageId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.exhaleTimerId && clearInterval(this.exhaleTimerId);
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.exhaleCountDownDelayId && clearTimeout(this.exhaleCountDownDelayId);
  }

  render() {
    const {
      exhaleTimer,
      successMessage,
      inhaleTimer,
      showHelperIcon,
      IntroSlidesVisible,
      smoothWord,
      breathCountVisible,
      showArrowIcon,
    } = this.state;
    const {
      onboardingCompleted,
      userInfo,
      navigation,
      pressInParent,
    } = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const helperIcon = userInfo.breathCount > 0 ? tapIcon : tapIconFirstTimer;
    const canGoToSettings =
      onboardingCompleted && !pressInParent && showArrowIcon;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={IntroSlidesVisible}>
          <IntroSlides closeExplainer={this.closeExplainer} />
        </Modal>
        {canGoToSettings ? (
          <TouchableOpacity
            style={styles.arrowIconContainer}
            onPress={this.handleArroPresss}>
            <Image source={arrowRightIcon} style={styles.arrowIcon} />
          </TouchableOpacity>
        ) : null}
        {userInfo.breathCount && breathCountVisible ? (
          <View pointerEvents="none" style={styles.breathCountContainer}>
            <Animated.Text
              style={[
                styles.breathCountText,
                {opacity: this.breathCountOpacity},
              ]}>
              {this.getTotalBreathCount()}
            </Animated.Text>
          </View>
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
            <Text style={styles.successText}>{`Inhale ${smoothWord}`}</Text>
          </View>
        ) : null}

        {exhaleTimer ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{`Exhale ${smoothWord}`}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {showHelperIcon && !pressInParent ? (
          <View style={styles.tapIconHolder} pointerEvents="none">
            <Image source={helperIcon} style={styles.tapIcon} />
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {settings, userInfo, onboardingCompleted, currentSession} = state;
  return {
    settings,
    userInfo,
    onboardingCompleted,
    currentSession,
  };
};

export default connect(mapStateToProps)(BreathingGame);
