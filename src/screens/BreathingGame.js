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
const DEFAULT_DURATION = 6000;
const DURATION_PER_UNIT = DEFAULT_DURATION / 6;
const EXPAND_DURATION = DURATION_PER_UNIT;
const SHRINK_DURATION = DURATION_PER_UNIT * 2; // shrinking will take twice as time as expanding
export default class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullSceeen: false,
      longPressEnabled: false,
      gameType: 'exhales',
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
    const {gameType} = this.state;
    if (gameType === 'inhales') {
      this.startVibrating();
    }
    gameType === 'exhales' ? this.expandCircle() : this.shrinkCircle();
  };

  handlePressOut = () => {
    const {gameType} = this.state;
    if (gameType === 'exhales') {
      this.startVibrating();
    }
    gameType === 'exhales' ? this.shrinkCircle() : this.expandCircle();
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      const {gameType} = this.state;
      if (value === 7 && gameType === 'exhales') {
        this.setState({fullSceeen: true});

        this.props.closeModal();
      } else if (value === 1 && gameType === 'inhales') {
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
    this.setState({gameType: 'exhales', longPressEnabled: true});
  };

  startInhale = () => {
    this.radius.setValue(6);
    this.setState({gameType: 'inhales', longPressEnabled: true});
  };

  startVibrating = () => {
    Vibration.vibrate([1, 2, 1]);
  };
  stopVibrating = () => {
    Vibration.cancel();
  };

  render() {
    const {contentTag} = this.props;
    const {fullSceeen, longPressEnabled} = this.state;
    const radiusPercent = this.radius.interpolate({
      inputRange: [1, 7],
      outputRange: ['10%', '70%'],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <Text style={styles.category}>{contentTag}</Text>
        <TouchableOpacity onPress={this.props.minimize} style={styles.iconDown}>
          <Image source={downIcon} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!longPressEnabled}
          activeOpacity={1}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}>
          <Svg height="100%" width="100%">
            <Defs>
              <Mask id="mask" x="0" y="0" height="100%" width="100%">
                <Rect height="100%" width="100%" fill="#fff" />
                <AnimatedCircle
                  r={fullSceeen ? '100%' : radiusPercent}
                  cx="50%"
                  cy="50%"
                  stroke="red"
                  strokeWidth="1"
                  fill="black"
                />
              </Mask>
            </Defs>

            <Rect
              height="100%"
              width="100%"
              fill="rgba(0, 0, 0,0.95)"
              mask="url(#mask)"
              fill-opacity="0"
            />
            {longPressEnabled ? (
              <Circle
                r="25%"
                cx="50%"
                cy="50%"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                fill="none"
              />
            ) : null}
          </Svg>
        </TouchableOpacity>
        {longPressEnabled ? null : (
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
                <Text style={styles.buttonText}>Exhales</Text>
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
  category: {
    position: 'absolute',
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: RFValue(24),
    top: ScreenHeight * 0.25,
    left: 20,
    zIndex: 1,
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
    top: ScreenHeight / 2 + ScreenHeight * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    height: 60,
    width: '45%',
    backgroundColor: 'rgba(255,255,255, 0.4)',
  },
  buttonTouchable: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: RFValue(18),
  },
  iconDown: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 4,
  },
  iconStyle: {
    tintColor: 'white',
    height: 35,
    width: 35,
    resizeMode: 'cover',
  },
});
