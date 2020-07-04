import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  PanResponder,
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
      touchDisabled: false,
      gameExplainerVisible: false,
      showHelperIcon: false,
      pressIn: false,
      successMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
      smoothWord: null,
      breathCountVisible: true,
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
    this.closeModalId = null;
    this.fullScreenId = null;
    this.breathCountId = null;
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
        breathCountVisible: true,
      });
    });
  };

  exhaleCountDown = () => {
    this.props.imageFadeOut();
    this.exhaleTimerId = setInterval(() => {
      if (this.state.exhaleTimer === 1) {
        clearInterval(this.exhaleTimerId);
        this.props.goToNextBreathing();
        return;
      }
      this.setState((prevState) => ({exhaleTimer: prevState.exhaleTimer - 1}));
    }, 1000);
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

  startExhaleCountDown = () => {
    const {settings} = this.props;
    // .5 sec dealy between inhale and exhale
    // to make it look good.
    this.exhaleCountDownId = setTimeout(() => {
      clearTimeout(this.exhaleCountDownId);
      this.setState({exhaleTimer: settings.exhaleTime}, this.exhaleCountDown);
    }, 500);
  };

  newUserAction = () => {
    const {userInfo, dispatch, showContent, settings} = this.props;
    const {breathCount} = userInfo;
    if (breathCount === 4) {
      // show breathing tip;
      showContent();
      dispatch({type: 'ONBOARDING_COMPLETED'});
      dispatch({type: 'RESET_BREATH_COUNT'});
    } else {
      this.setState(
        // reset the success msg to create a gap between inhale and exhale message
        this.setState({successMessage: ''}),
        this.startExhaleCountDown,
      );
      dispatch({type: 'ADD_BREATH_COUNT'});
    }
  };

  oldUserAction = () => {
    const {dispatch, showContent, currentSession, settings} = this.props;
    const {selectedTags} = settings;
    const {breathCount} = currentSession;
    const hasSelectedTags = selectedTags.length;
    if (breathCount === 4) {
      if (hasSelectedTags) {
        showContent();
      } else {
        this.setState(
          this.setState({successMessage: ''}),
          this.startExhaleCountDown,
        );
      }
      dispatch({type: 'RESET_BREATH_COUNT'});
    } else {
      this.setState(
        // reset the success msg to create a gap between inhale and exhale message
        this.setState({successMessage: ''}),
        this.startExhaleCountDown,
      );
      dispatch({type: 'ADD_BREATH_COUNT'});
    }
  };

  startExhale = () => {
    this.setState({touchDisabled: true});
    const {onboardingCompleted} = this.props;
    onboardingCompleted ? this.oldUserAction() : this.newUserAction();
  };

  handlePressOut = () => {
    const radiusValue = this.radius._value;
    const fullScreenRevealed = radiusValue === 7;
    Animated.timing(this.radius).stop();
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    !fullScreenRevealed ? this.shrinkCircle() : this.startExhale();
  };

  handlePressIn = () => {
    if (this.state.exhaleTimer) {
      return;
    }
    this.setState({pressIn: true, successMessage: ''});
    this.pressInTime = new Date();
    this.startInhaleTimer();
    this.expandCircle();
  };

  showGameExplainerModal = () => {
    this.explainerModalId = setTimeout(
      () => this.setState({gameExplainerVisible: true}),
      1200,
    );
  };

  closeExplainer = () => {
    this.setState({gameExplainerVisible: false});
    this.showHelpers();
    clearTimeout(this.explainerModalId);
  };

  setStartRadius = (inhaleTime) => {
    this.startRadius = START_RADIUSES[inhaleTime];
    this.radius.setValue(this.startRadius);
    this.helperMessage = `Hold while you inhale for ${inhaleTime} seconds`;
    this.delayMessage = `Inhale for ${inhaleTime} seconds`;
    this.setState({successMessage: this.helperMessage});
  };

  showHelpers = () => {
    this.hlperMessageId = setTimeout(() => {
      if (!this.state.pressIn) {
        this.setState({successMessage: this.helperMessage});
      }
    }, 400);
    this.showHelperIcon();
  };

  showHelperIcon = () => {
    this.helperIconId = setTimeout(
      () => this.setState({showHelperIcon: true}),
      800,
    );
  };

  getTotalBreathCount = () => {
    const {userInfo} = this.props;
    return userInfo.breathCount.toLocaleString();
  };

  componentDidMount() {
    this.showHelpers();
    this.animationId = this.radius.addListener(({value}) => {});
    if (this.props.pressInParent) {
      this.handlePressIn();
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
    this.idleTimerId && clearTimeout(this.inhaleTimerId);
    this.explainerModalId && clearTimeout(this.explainerModalId);
    this.hlperMessageId && clearTimeout(this.hlperMessageId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.exhaleTimerId && clearInterval(this.exhaleTimerId);
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.closeModalId && clearTimeout(this.closeModalId);
    this.fullScreenId && clearTimeout(this.fullScreenId);
    this.breathCountId && clearTimeout(this.breathCountId);
  }

  render() {
    const {
      exhaleTimer,
      successMessage,
      touchDisabled,
      inhaleTimer,
      showHelperIcon,
      gameExplainerVisible,
      pressIn,
      breathCountVisible,

      smoothWord,
    } = this.state;
    const {onboardingCompleted, userInfo, navigation} = this.props;
    // 72% is the the value to reveal the full screen.
    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });
    const reactFillColor = 'white';
    const circleFillColor = 'black';
    const helperIcon = userInfo.breathCount > 0 ? tapIcon : tapIconFirstTimer;
    // TODO: uncomment this later
    const showArrowIcon = onboardingCompleted && !pressIn;
    return (
      <View style={styles.container}>
        {gameExplainerVisible && (
          <GameExplainer closeExplainer={this.closeExplainer} />
        )}
        {showArrowIcon ? (
          <TouchableOpacity
            style={styles.arrowIconContainer}
            onPress={() => navigation.navigate('Settings')}>
            <Image source={arrowRightIcon} style={styles.arrowIcon} />
          </TouchableOpacity>
        ) : null}
        {userInfo.breathCount && breathCountVisible ? (
          <View pointerEvents="none" style={styles.breathCountContainer}>
            <Text style={styles.breathCountText}>
              {this.getTotalBreathCount()}
            </Text>
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
