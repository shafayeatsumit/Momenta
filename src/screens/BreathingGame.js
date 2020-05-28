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
const THREE_SECONDS_AWAY = 3000 / DURATION_PER_UNIT;
export default class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullSceeen: false,
      gameStarted: false,
      pressIn: false,
      showFirstCircle: true,
      gameType: 'inhales',
    };
    this.radius = new Animated.Value(1);
    this.animationId = null;
    this.startTime = null;
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
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  handlePressIn = () => {
    const {gameType, gameStarted} = this.state;
    if (!gameStarted) {
      this.setState({gameStarted: true, pressIn: true});
    } else {
      this.setState({pressIn: true});
    }
    gameType === 'inhales' ? this.expandCircle() : this.shrinkCircle();
  };

  handlePressOutInhale = () => {
    const {showSecondCircle} = this.state;
    const currentRadiusValue = this.radius._value;
    const roundedValue = (Math.round(currentRadiusValue * 100) / 100).toFixed(
      2,
    );
    if (roundedValue > THREE_SECONDS_AWAY && !showSecondCircle) {
      const secondCircleRadius = currentRadiusValue + THREE_SECONDS_AWAY;
      this.setState({
        pressIn: false,
        showSecondCircle: true,
        secondCircleRadius,
      });
    } else {
      this.setState({pressIn: false});
    }
    console.log('current value', roundedValue);
  };

  handlePressOutExhale = () => {
    const currentRadius = this.radius._value;
    this.setState({pressIn: false});
  };

  handlePressOut = () => {
    const {gameType} = this.state;
    Animated.timing(this.radius).stop();
    gameType === 'inhales'
      ? this.handlePressOutInhale()
      : this.handlePressOutExhale();
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const {
        gameType,
        showFirstCircle,
        showSecondCircle,
        secondCircleRadius,
      } = this.state;
      const roundedValue = (Math.round(value * 100) / 100).toFixed(2);

      // for game typ inhale, hide circles when it hits certain target.
      if (roundedValue > 2 && showFirstCircle) {
        this.setState({showFirstCircle: false});
        this.vibrate();
      } else if (roundedValue > secondCircleRadius && showSecondCircle) {
        this.setState({showSecondCircle: false});
        this.vibrate();
      }

      if (value === 7 && gameType === 'inhales') {
        this.props.closeModal();
      } else if (value === 1 && gameType === 'exhales') {
        this.props.closeModal();
      }
    });
  }

  componentWillUnmount() {
    if (this.animationId) {
      this.radius.removeListener(this.animationId);
    }
  }

  startExhale = () => {
    this.radius.setValue(6);
    this.setState({gameType: 'exhales', gameStarted: true});
  };

  startInhale = () => {
    this.setState({gameType: 'inhales', gameStarted: true});
  };

  vibrate = () => {
    Vibration.vibrate();
  };
  stopVibrating = () => {
    Vibration.cancel();
  };

  render() {
    const {contentTag} = this.props;
    const {
      fullSceeen,
      gameType,
      gameStarted,
      pressIn,
      showSecondCircle,
      secondCircleRadius,
    } = this.state;
    const showHelperText = gameStarted && pressIn === false;
    const helperText = gameType === 'inhales' ? 'Exhale fully' : 'Inhale fully';

    const radiusForExhales = this.radius.interpolate({
      inputRange: [0, 6],
      outputRange: ['0%', '60%'],
      extrapolate: 'clamp',
    });
    const radiusForInhales = this.radius.interpolate({
      inputRange: [1, 7],
      outputRange: ['10%', '70%'],
      extrapolate: 'clamp',
    });
    const radiusPercent =
      gameType === 'inhales' ? radiusForInhales : radiusForExhales;
    const reactFillColor = gameType === 'inhales' ? '#fff' : '#1b1f37';
    const circleFillColor = gameType === 'inhales' ? '#1b1f37' : '#fff';
    // times 10 is because the output range is 10 times than the input range.
    const firstOuterCircleRadius = `${THREE_SECONDS_AWAY * 10}%`;
    const showFirstCircle = gameStarted && this.state.showFirstCircle;
    return (
      <View style={styles.container}>
        <View style={styles.categoryHolder}>
          <Text style={styles.category}>{contentTag}</Text>
        </View>

        <TouchableOpacity onPress={this.props.minimize} style={styles.iconDown}>
          <Image source={downIcon} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}>
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
                <AnimatedCircle
                  r={'10%'}
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
              fill="#1b1f37"
              mask="url(#mask)"
              fill-opacity="0"
            />
            {showFirstCircle && (
              <Circle
                cx="50%"
                cy="50%"
                r={firstOuterCircleRadius}
                stroke="rgb(120,121,137)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="10,4"
              />
            )}
            {showSecondCircle && (
              <Circle
                cx="50%"
                cy="50%"
                r={`${secondCircleRadius * 10}%`}
                stroke="rgb(120,121,137)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="8,3"
              />
            )}
          </Svg>
        </TouchableOpacity>
        {showHelperText ? (
          <TouchableOpacity style={styles.helperTextContainer}>
            <Text style={styles.helperText}>{helperText}</Text>
          </TouchableOpacity>
        ) : null}
        {gameStarted ? null : (
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
        )}
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
    bottom: ScreenHeight * 0.2,
    width: ScreenWidth,
    zIndex: 1,
  },
  helperText: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 25,
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
    zIndex: 1,
  },
  iconStyle: {
    tintColor: 'white',
    height: 35,
    width: 35,
    resizeMode: 'cover',
    zIndex: 2,
  },
});
