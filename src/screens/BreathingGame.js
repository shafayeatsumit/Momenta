import React, {Component} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  Text,
  Vibration,
} from 'react-native';
import {
  TapGestureHandler,
  State,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import {FontType} from '../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../helpers/constants/common';
import {RFValue} from '../helpers/responsiveFont';

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

  onStateChange = ({nativeEvent}) => {
    const {fullSceeen, gameType} = this.state;
    const {closeModal} = this.props;
    if (fullSceeen) {
      closeModal();
      return;
    }
    if (nativeEvent.state === State.BEGAN) {
      if (gameType === 'exhales') {
        this.startVibrating();
      }
      gameType === 'exhales' ? this.shrinkCircle() : this.expandCircle();
    } else if (nativeEvent.state === State.END) {
      if (gameType === 'inhales') {
        this.startVibrating();
      }

      gameType === 'exhales' ? this.expandCircle() : this.shrinkCircle();
    }
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      // console.log('value', value);
      const {gameType} = this.state;
      if (value === 7 && gameType === 'inhales') {
        this.setState({fullSceeen: true});

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
    this.setState({gameType: 'exhales', longPressEnabled: true});
  };

  startVibrating = () => {
    Vibration.vibrate([1, 2, 1]);
  };
  stopVibrating = () => {
    Vibration.cancel();
  };
  startInhale = () => {
    this.setState({gameType: 'inhales', longPressEnabled: true});
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
        <TapGestureHandler
          onHandlerStateChange={longPressEnabled ? this.onStateChange : null}>
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
        </TapGestureHandler>
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
    zIndex: 4,
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
});
