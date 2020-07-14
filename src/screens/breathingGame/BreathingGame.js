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

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touchDisabled: false,
      focusModalvisible: false,
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
    this.setState({showHelperIcon: true});
    Animated.timing(this.tapAnimation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  };

  shrinkCircleCb = () => {
    this.setState(
      {
        showHelperIcon: true,
        breathCountVisible: true,
        successMessage: '',
      },
      this.showArrowIcon,
    );
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
    this.startInhale();
    this.expandCircle();
  };

  closeFocusModal = () =>
    this.setState({focusModalvisible: false}, this.showHelpers);

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
        this.helperAnimatePressIn();
        this.setState({
          showHelperIcon: true,
        });
      }
    }, 800);
    this.showArrowIcon();
  };

  handleArrowPresss = () => {
    const {navigation} = this.props;
    navigation.navigate('Settings');
    analytics().logEvent('viewed_settings');
  };

  showPressOutHelper = () => {
    const {pressInParent} = this.props;
    this.pressOutHelperId = setTimeout(() => {
      !pressInParent && this.setState({successMessage: 'show release helper'});
      clearTimeout(this.pressOutHelperId);
    }, 1000);
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const fullScreenRevealed = value === 7;
      if (fullScreenRevealed) {
        // showPressOutAnimation helper
        this.showPressOutHelper();
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
    const {
      successMessage,
      showHelperIcon,
      focusModalvisible,
      showArrowIcon,
    } = this.state;
    const {onboardingCompleted, pressInParent} = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const canGoToSettings =
      onboardingCompleted && !pressInParent && showArrowIcon;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={focusModalvisible}>
          <IntroSlides closeModal={this.closeFocusModal} />
        </Modal>
        {canGoToSettings ? (
          <TouchableOpacity
            style={styles.arrowIconContainer}
            onPress={this.handleArrowPresss}>
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
            colorFilters={[
              {
                keypath: 'hand 2',
                color: '#FFFFFF',
              },
              {
                keypath: 'line',
                color: '#3c71de',
              },
            ]}
            source={require('../../../assets/anims/tap_and_hold.json')}
          />
        )}
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
