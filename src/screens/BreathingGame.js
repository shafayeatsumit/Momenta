import React, {Component} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {FontType} from '../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../helpers/constants/common';
import {RFValue} from '../helpers/responsiveFont';
import downIcon from '../../assets/icons/down.png';
import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DEFAULT_DURATION = 9000;
const DURATION_PER_UNIT = DEFAULT_DURATION / 6;
const EXPAND_DURATION = DURATION_PER_UNIT;
const SHRINK_DURATION = DURATION_PER_UNIT;
const TWO_SECONDS_EXPAND = (2000 / DURATION_PER_UNIT).toFixed(2);
const FOUR_SECONDS_EXPAND = (4000 / DURATION_PER_UNIT).toFixed(2);
const TWO_SECONDS_SHRINK = (7 - 2000 / DURATION_PER_UNIT).toFixed(2);
const FOUR_SECONDS_SHRINK = (7 - 4000 / DURATION_PER_UNIT).toFixed(2);

const INHALE_START_MESSAGE = 'Hold as you slowly inhale. Release as you exhale';
const EXHALE_MESSAGE = 'Exhale and then continue slow inhale when ready';
const INHALE_MESSAGE = 'Hold as you slowly exhale. Release as you inhale';
export default class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullSceeen: false,
      gameStarted: false,
      pressIn: false,
      gameType: 'inhales',
      successMessage: null,
    };
    this.radius = new Animated.Value(1);
    this.animationId = null;
    this.startTime = null;
    this.goodId = null;
    this.greatId = null;
    this.removeerId = null;
    this.vibrationId = null;
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

  shrinkCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (currentRadius - 1) * SHRINK_DURATION;
    Animated.timing(this.radius, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  removeSuccess = () => {
    this.removeerId = setTimeout(
      () => this.setState({successMessage: null}),
      500,
    );
  };
  handlePressIn = () => {
    const {gameType, gameStarted} = this.state;
    this.goodId = setTimeout(() => {
      this.setState({successMessage: 'good'});
      this.removeSuccess();
    }, 2000);
    this.greatId = setTimeout(() => {
      this.setState({successMessage: 'great'});
      this.removeSuccess();
    }, 4000);
    this.vibrationId = setInterval(this.vibrate, 1000);
    if (!gameStarted) {
      this.setState({gameStarted: true, pressIn: true});
    } else {
      this.setState({pressIn: true});
    }
    gameType === 'inhales' ? this.expandCircle() : this.shrinkCircle();
  };

  componentWillUnmount() {
    if (this.goodId) {
      clearTimeout(this.goodId);
    }
    if (this.greatId) {
      clearTimeout(this.greatId);
    }
    if (this.removeerId) {
      clearTimeout(this.removeerId);
    }
    if (this.vibrationId) {
      clearInterval(this.vibrationId);
    }
    if (this.animationId) {
      this.radius.removeListener(this.animationId);
    }
  }
  handlePressOut = () => {
    Animated.timing(this.radius).stop();
    this.setState({pressIn: false});
    if (this.goodId) {
      clearTimeout(this.goodId);
    }
    if (this.greatId) {
      clearTimeout(this.greatId);
    }
    if (this.removeerId) {
      clearTimeout(this.removeerId);
    }
    if (this.vibrationId) {
      clearInterval(this.vibrationId);
    }
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const roundedValue = (Math.round(value * 100) / 100).toFixed(2);
      const {gameType} = this.state;
      if (value === 7 && gameType === 'inhales') {
        this.props.closeModal();
      } else if (value === 0 && gameType === 'exhales') {
        this.props.closeModal();
      }
    });
  }

  // componentWillUnmount() {
  //   if (this.animationId) {
  //     this.radius.removeListener(this.animationId);
  //   }
  // }

  startExhale = () => {
    this.radius.setValue(7.2);
    this.setState({gameType: 'exhales', gameStarted: true});
  };

  startInhale = () => {
    this.setState({gameType: 'inhales', gameStarted: true});
  };

  vibrate = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(40);
    } else {
      Vibration.vibrate();
    }
  };

  stopVibrating = () => {
    Vibration.cancel();
  };

  render() {
    const {contentTag} = this.props;
    const {fullSceeen, gameType, gameStarted, pressIn} = this.state;
    const showHelperText = gameStarted && pressIn === false;
    const helperText = gameType === 'inhales' ? EXHALE_MESSAGE : INHALE_MESSAGE;
    const helperTextMarginBottom = gameType === 'inhales' ? 0.2 : 0.45;

    const radiusPercent = this.radius.interpolate({
      inputRange: [0, 7.2],
      outputRange: ['0%', '72%'],
      extrapolate: 'clamp',
    });

    const reactFillColor = gameType === 'inhales' ? 'white' : 'black';
    const circleFillColor = gameType === 'inhales' ? 'black' : 'white';

    return (
      <View style={styles.container}>
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
                r={fullSceeen ? '100%' : radiusPercent}
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

        {showHelperText ? (
          <View
            style={[
              styles.helperTextContainer,
              {bottom: ScreenHeight * helperTextMarginBottom},
            ]}
            pointerEvents="none">
            <Text style={styles.helperText}>{helperText}</Text>
          </View>
        ) : null}

        {!showHelperText && this.state.successMessage && (
          <View
            style={[styles.helperTextContainer, {bottom: ScreenHeight * 0.2}]}
            pointerEvents="none">
            <Text style={styles.successText}>{this.state.successMessage}</Text>
          </View>
        )}
        {gameStarted ? null : (
          <View
            style={[styles.helperTextContainer, {bottom: ScreenHeight * 0.2}]}
            pointerEvents="none">
            <Text style={styles.successText}>{INHALE_START_MESSAGE}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.tapArea}
          activeOpacity={1}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        />
        {/* {gameStarted ? null : (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={this.startInhale}>
                <Text style={styles.buttonText}>Inhales</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={this.startExhale}>
                <Text style={styles.buttonTextDim}>Exhales</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.25,
    left: 0,
    width: ScreenWidth,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    height: 100,
    width: ScreenWidth / 2,
    left: ScreenWidth / 4,
    top: ScreenHeight / 2 + ScreenHeight * 0.2,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    height: 60,
    width: '45%',
  },
  buttonTouchable: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
  },
  buttonTextDim: {
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 20,
  },
  helperTextContainer: {
    position: 'absolute',
    width: ScreenWidth,
    zIndex: 1,
  },
  helperText: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 18,
    marginHorizontal: 15,
    // zIndex: 2,
  },
  successText: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 16,
    marginHorizontal: 15,
    // zIndex: 2,
  },

  iconDownContainer: {
    zIndex: 1,
  },
  iconDown: {
    position: 'absolute',
    top: 30,
    left: 20,
    height: 35,
    width: 35,
    tintColor: 'rgba(255,255,255,0.8)',
    zIndex: 2,
  },
  iconStyle: {
    tintColor: 'white',
    height: 35,
    width: 35,
    resizeMode: 'cover',
    zIndex: 2,
  },
  tapArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.3,
  },
});
