import React, {Component} from 'react';
import {View, Animated, StyleSheet, Easing, Text} from 'react-native';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {FontType} from '../helpers/theme';
import {ScreenHeight} from '../helpers/constants/common';
import {RFValue} from '../helpers/responsiveFont';

import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DEFAULT_DURATION = 6000;
const DURATION_UNIT = DEFAULT_DURATION / 6;
export default class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullSceeen: false,
    };
    this.radius = new Animated.Value(1);
    this.animationId = null;
    this.startTime = null;
  }

  expandCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (7 - currentRadius) * DURATION_UNIT;
    Animated.timing(this.radius, {
      toValue: 7,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  shrinkCircle = () => {
    const currentRadius = this.radius._value;
    const duration = (currentRadius - 1) * DURATION_UNIT;
    Animated.timing(this.radius, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  onStateChange = ({nativeEvent}) => {
    const {fullSceeen} = this.state;
    const {closeModal} = this.props;
    if (fullSceeen) {
      closeModal();
      return;
    }
    if (nativeEvent.state === State.BEGAN) {
      this.expandCircle();
    } else if (nativeEvent.state === State.END) {
      this.shrinkCircle();
    }
  };

  componentDidMount() {
    this.animationId = this.radius.addListener(({value}) => {
      // console.log('value', value);
      if (value === 7) {
        this.setState({fullSceeen: true});
        this.props.closeModal();
      }
    });
  }

  componentWillUnmount() {
    if (this.animationId) {
      this.radius.removeListener(this.animationId);
    }
  }

  render() {
    const {contentTag} = this.props;
    const {fullSceeen} = this.state;
    const radiusPercent = this.radius.interpolate({
      inputRange: [1, 7],
      outputRange: ['10%', '70%'],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <Text style={styles.category}>{contentTag}</Text>
        <TapGestureHandler onHandlerStateChange={this.onStateChange}>
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
          </Svg>
        </TapGestureHandler>
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
});
