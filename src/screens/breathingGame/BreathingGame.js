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
import arrowRightIcon from '../../../assets/icons/arrow_right.png';
import LottieView from 'lottie-react-native';

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
const FIRST_ONBOARDING_MSG =
  'Tap and hold as you inhale slowly to reveal the calming image';
const SECOND_ONBOARDING_MSG = 'Release just after image is revealed';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: false,
      showHelperIcon: false,
      successMessage: '',
    };

    this.startRadius = START_RADIUSES[props.settings.inhaleTime];
    this.radius = new Animated.Value(this.startRadius);
    this.tapAnimation = new Animated.Value(0);
    // all the timers
    this.focusModalId = null;
    this.hlperMessageId = null;
    this.helperIconId = null;
    this.inhaleTimerId = null;
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

  helperAnimatePressIn = () => {
    Animated.timing(this.tapAnimation, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start(() => {
      this.tapAnimation.setValue(0);
      this.helperAnimatePressIn();
    });
  };

  shrinkCircleCb = () => {
    this.setState(
      {
        showHelperIcon: true,
        breathCountVisible: true,
        successMessage: '',
        touchDisabled: false,
      },
      () => {
        this.showArrowIcon();
        this.props.pressInParent && this.handlePressIn();
      },
    );
  };

  shrinkCircle = () => {
    this.setState({
      successMessage: 'Almost, give it another shot',
      showHelperIcon: false,
      showArrowIcon: false,
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
    const smoothWord = _.sample(SMOOTH_WORDS);
    this.setState({successMessage: `Exhale ${smoothWord}`});
  };

  startInhale = () => {
    const {settings} = this.props;
    const smoothWord = _.sample(SMOOTH_WORDS);
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
      this.setState({showArrowIcon: false, touchDisabled: true});
    } else {
      this.shrinkCircle();
    }
  };

  handlePressIn = () => {
    if (this.state.touchDisabled) {
      console.log('exhale timer');
      return;
    }
    this.startInhale();
    this.expandCircle();
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

  showOnboardingSuccessMsg = () => {
    const {onboarding} = this.props;
    if (onboarding.breathCount === 0) {
      this.setState({successMessage: FIRST_ONBOARDING_MSG});
    } else if (onboarding.breathCount === 1) {
      // if required
      this.setState({successMessage: SECOND_ONBOARDING_MSG});
    }
  };

  showHelpers = () => {
    this.hlperMessageId = setTimeout(() => {
      if (!this.props.pressInParent) {
        // TODO: remove this later
        this.helperAnimatePressIn();
        this.setState({
          showHelperIcon: true,
        });
      }
    }, 800);
    this.showArrowIcon();
    const {onboarding} = this.props;
    onboarding.breathingTutorial && this.showOnboardingSuccessMsg();
  };

  handleArrowPresss = () => {
    const {navigation} = this.props;
    navigation.navigate('Settings');
    analytics().logEvent('viewed_settings');
  };

  showPressOutHelper = () => {
    this.pressOutHelperId = setTimeout(() => {
      const {pressInParent, dispatch, onboarding} = this.props;
      const {touchDisabled} = this.state;
      if (pressInParent && touchDisabled) {
        this.setState({successMessage: 'show release helper'});
      }
      // user needs another breath.
      if (pressInParent && onboarding.breathCount === 0) {
        dispatch({type: 'ONBOARDING_ADD_BREATH_COUNT'});
      }

      clearTimeout(this.pressOutHelperId);
    }, 1000);
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    return `${currentSession.breathCount}/${settings.breathPerSession}`;
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const fullScreenRevealed = value === 7;
      const {onboarding, dispatch} = this.props;
      if (fullScreenRevealed) {
        // showPressOutAnimation helper
        this.showPressOutHelper();
        if (!onboarding.breathingTutorial) {
          dispatch({type: 'ADD_BREATH_COUNT'});
        } else if (onboarding.breathCount === 1) {
          // new user took second breath now finish breathing tutorial
          dispatch({type: 'FINISH_BREATHING_TUTORIAL'});
        }
      }
    });
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
    this.focusModalId && clearTimeout(this.focusModalId);
    this.hlperMessageId && clearTimeout(this.hlperMessageId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.inhaleTimerId && clearTimeout(this.inhaleTimerId);
    this.hideHelperId && clearTimeout(this.hideHelperId);
    this.showHelperId && clearTimeout(this.showHelperId);
  }

  render() {
    const {successMessage, showHelperIcon, showArrowIcon} = this.state;
    const {onboarding, pressInParent} = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const finishedBreathingTutorial = !onboarding.breathingTutorial;
    const canGoToSettings =
      onboarding.completed && !pressInParent && showArrowIcon;
    return (
      <View style={styles.container}>
        {canGoToSettings ? (
          <TouchableOpacity
            style={styles.arrowIconContainer}
            onPress={this.handleArrowPresss}>
            <Image source={arrowRightIcon} style={styles.arrowIcon} />
          </TouchableOpacity>
        ) : null}
        {finishedBreathingTutorial && (
          <View style={styles.progressContainer} pointerEvents="none">
            <Text style={styles.progressText}>{this.getProgress()}</Text>
          </View>
        )}

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

        {successMessage ? (
          <View style={styles.successTextContainer} pointerEvents="none">
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {showHelperIcon && !pressInParent && (
          <LottieView
            progress={this.tapAnimation}
            autoSize
            style={styles.tapIconHolder}
            source={require('../../../assets/anims/release.json')}
          />
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
