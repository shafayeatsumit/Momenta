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
      touchDisabled: true,
      modalVisible: false,
      showHelperIcon: false,
      gameStarted: false,
      firstInhaleCompleted: false,
      helperMessage: '',
      successMessage: '',
      exhaleTimer: 0,
      inhaleTimer: 0,
    };
    this.radius = new Animated.Value(1);
    this.pressInTime = null;
    // all the timers
    this.explainerModalId = null;
    this.firstHlperMessageId = null;
    this.helperIconId = null;
    this.exhaleTimerId = null;
    this.inhaleTimerId = null;
    this.startExhaleTimerId = null;
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
        ...(prevState.exhaleTimer === 1 && {touchDisabled: false}),
      }));
    }, 1000);
  };

  startInhaleTimer = () => {
    this.inhaleTimerId = setInterval(() => {
      this.setState((prevState) => ({
        inhaleTimer: prevState.inhaleTimer + 1,
      }));
    }, 1000);
  };

  firstInhale = (timeDiff) => {
    if (timeDiff < 3) {
      console.log('less than 3', timeDiff);
      this.shrinkBack();
      return;
    }
    const timeDiffRounded = timeDiff.toFixed(1);
    let message = '';
    if (timeDiff > 3 && timeDiff < 4) {
      message = `Success ${timeDiffRounded}`;
    } else if (timeDiff > 4 && timeDiff < 5) {
      message = `Perfect ${timeDiffRounded}`;
      this.setState({successMessage: message, touchDisabled: true});
    } else {
      message = `great ${timeDiffRounded}`;
      this.setState({
        successMessage: message,
        touchDisabled: true,
      });
    }
    this.setState({
      successMessage: message,
      touchDisabled: true,
      firstInhaleCompleted: true,
    });

    // after 1 sec when cleared success msg we can start exhale timer.
    this.startExhaleTimerId = setTimeout(() => {
      this.setState(
        {successMessage: false, exhaleTimer: Math.ceil(timeDiff)},
        this.startExhaleTimer,
      );
    }, 1000);
  };

  handlePressOut = () => {
    const {firstInhaleCompleted} = this.state;
    Animated.timing(this.radius).stop();
    const timeDiff = (new Date() - this.pressInTime) / 1000;
    // clearing inhale timer
    this.state.inhaleTimer && this.setState({inhaleTimer: 0});
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);

    if (!firstInhaleCompleted) {
      clearInterval(this.inhaleTimerId);
      this.firstInhale(timeDiff);
    } else {
    }
  };

  handlePressIn = () => {
    const {gameStarted, firstInhaleCompleted} = this.state;
    this.pressInTime = new Date();
    if (!firstInhaleCompleted) {
      this.startInhaleTimer();
    }
    this.expandCircle();

    if (!gameStarted) {
      this.setState({gameStarted: true});
    }
  };

  showExplainerModal = () => {
    this.explainerModalId = setTimeout(
      () => this.setState({modalVisible: true}),
      1000,
    );
  };

  closeExplainer = () => {
    this.setState({modalVisible: false});
    this.showFirstHelperMessage();
    clearTimeout(this.explainerModalId);
  };

  showFirstHelperMessage = () => {
    this.firstHlperMessageId = setTimeout(
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

  componentWillUnmount() {
    this.animationId && this.radius.removeListener(this.animationId);
    this.explainerModalId && clearTimeout(this.explainerModalId);
    this.firstHlperMessageId && clearTimeout(this.firstHlperMessageId);
    this.helperIconId && clearTimeout(this.helperIconId);
    this.exhaleTimerId && clearInterval(this.exhaleTimerId);
    this.inhaleTimerId && clearInterval(this.inhaleTimerId);
    this.startExhaleTimerId && clearTimeout(this.startExhaleTimerId);
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
