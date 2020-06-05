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
const THREE_SECONDS_EXPAND = 3000 / DURATION_PER_UNIT;

const FIRST_HELPER_MESSAGE =
  'Hold on your next inhale. Release after 4 seconds';
const SECOND_HELPER_MESSAGE = 'Get ready to inhale for 4 seconds without timer';
const TRY_AGAIN_MESSAGE = 'Give it another shot';

class InhaleFirstLaunch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successMessage: '',
      touchDisabled: true,
      modalVisible: false,
      showHelperIcon: false,
      gameStarted: false,
      firstInhaleCompleted: false,
      breathCompleted: 0,
      helperMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
    };
    this.radius = new Animated.Value(1);
    // all the timers
    this.explainerModalId = null;
    this.firstHlperId = null;
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

  clearRleaseMessage = () => {
    clearTimeout(this.releaseMessageId);
    this.setState({helperMessage: SECOND_HELPER_MESSAGE});
  };

  startInhaleTimer = () => {
    this.inhaleTimerId = setInterval(() => {
      this.setState((prevState) => ({
        inhaleTimer: prevState.inhaleTimer + 1,
      }));
    }, 1000);
  };

  shrinkBack = () => {
    this.setState({touchDisabled: true, successMessage: TRY_AGAIN_MESSAGE});

    Animated.timing(this.radius, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.setState({touchDisabled: false, successMessage: ''});
    });
  };

  handlePressIn = () => {
    const {gameStarted, firstInhaleCompleted} = this.state;
    this.pressInTime = new Date();
    if (!firstInhaleCompleted) {
      this.startInhaleTimer();
    } else {
      this.setState({successMessage: 'Inhale'});
    }

    this.expandCircle();
    // if (!gameStarted) {
    //   this.setState({gameStarted: true});
    //   this.releaseMessageId = setTimeout(() => {
    //     this.setState({helperMessage: 'release'});
    //   }, 4000);
    // }
  };

  firstInhale = (timeDiff) => {
    // console.log('time diff', timeDiff);
    // console.log('time diff less then 3', timeDiff < 3);
    if (timeDiff < 3) {
      this.shrinkBack();
      return;
    }
    this.props.dispatch({type: 'PLAYED_BREATHING_GAME'});
    this.setState({
      firstInhaleCompleted: true,
      helperMessage: SECOND_HELPER_MESSAGE,
    });

    const timeDiffRounded = timeDiff.toFixed(1);
    let message = '';
    if (timeDiff > 3 && timeDiff < 4) {
      message = `Success ${timeDiffRounded}`;
      console.log('message', message);
    } else if (timeDiff > 4 && timeDiff < 5) {
      console.log('message', message);
      message = `Pefect ${timeDiffRounded}`;
    } else if (timeDiff > 5) {
      this.setSuccessMessage(timeDiff);
      return;
    }
    // this.setState({
    //   successMessage: message,
    //   touchDisabled: true,
    // });
    // setTimeout(
    //   () =>
    //     this.setState(
    //       {
    //         successMessage: false,
    //         exhaleTimer: Math.ceil(timeDiff),
    //       },
    //       this.startExhaleTimer,
    //     ),
    //   1000,
    // );
  };

  handlePressOut = () => {
    const {firstInhaleCompleted} = this.state;
    // clearing out inhale timer
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});

    Animated.timing(this.radius).stop();

    // time diff callculation margin of error 0.6
    const timeDiff = (new Date() - this.pressInTime) / 1000;
    if (!firstInhaleCompleted) {
      this.firstInhale(timeDiff);
    } else {
      this.setSuccessMessage(timeDiff);
    }
    this.releaseMessageId && this.clearRleaseMessage();
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

  setSuccessMessage = (breathingTime) => {
    const radiusValue = this.radius._value;
    const fullScreenRevealed = radiusValue === 7;
    let message = '';
    let roundedBreathingTime = breathingTime.toFixed(1);

    if (breathingTime < 2 && fullScreenRevealed) {
      this.setState({touchDisabled: true});
      this.showFullScreen();
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

  showExplainerModal = () => {
    this.explainerModalId = setTimeout(
      () => this.setState({modalVisible: true}),
      1500,
    );
  };

  closeExplainer = () => {
    const {dispatch} = this.props;
    this.setState({modalVisible: false});
    // dispatch({type: 'PLAYED_BREATHING_GAME_FIRST_TIME'});
    this.showFirstHelperText();
  };

  showFirstHelperText = () => {
    this.firstHlperId = setTimeout(
      () => this.setState({helperMessage: FIRST_HELPER_MESSAGE}),
      600,
    );
    this.showHelperIcon();
  };

  showHelperIcon = () => {
    this.helperIconId = setTimeout(
      () => this.setState({showHelperIcon: true, touchDisabled: false}),
      1500,
    );
  };

  componentDidMount() {
    this.showExplainerModal();
    this.animationId = this.radius.addListener(({value}) => {});
  }

  render() {
    const {contentTag} = this.props;
    const {
      helperMessage,
      exhaleTimer,
      successMessage,
      touchDisabled,
      inhaleTimer,
      showHelperIcon,
      modalVisible,
      gameStarted,
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
        {showHelperIcon && !gameStarted ? (
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
  const {firstLaunch} = state;
  const {breathingGameFirstRun} = firstLaunch;
  return {
    breathingGameFirstRun,
  };
};

export default connect(mapStateToProps)(InhaleFirstLaunch);
