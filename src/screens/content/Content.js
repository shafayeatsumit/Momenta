import React from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
// import styles from './Content.styles';
import {Colors, FontType} from '../../helpers/theme';
import WaveView from '../../components/WaveView';
import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  // Text,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
import {ScreenWidth} from '../../helpers/constants/common';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleCircumference = 2 * Math.PI * 160;
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.animatedOffSet = new Animated.Value(CircleCircumference);
    this.animatedRadius = new Animated.Value(85);
  }

  animate = () => {
    Animated.parallel([
      Animated.timing(this.animatedOffSet, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: 158,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  componentDidMount() {
    this.animate();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.svgHolder}>
          <View style={styles.textHolder}>
            <Text style={styles.text}>
              Building your{'\n'}
              exercise
            </Text>
          </View>
          <Svg height="100%" width="100%" style={styles.svg}>
            <G rotation="-90" origin={('160', '160')}>
              <AnimatedCircle
                cx="158"
                cy="162"
                r="160"
                stroke="#447d70"
                strokeWidth="2"
                fill="none"
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <AnimatedCircle
                cx="158"
                cy="162"
                r={this.animatedRadius}
                strokeWidth="0"
                fill={Colors.cornflowerBlue}
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <Circle
                cx="158"
                cy="162"
                r="85"
                strokeWidth="0"
                fill={'#13172f'}
                strokeDasharray={CircleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
            </G>
          </Svg>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgHolder: {
    height: 324,
    width: 324,
    marginBottom: 80,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  textHolder: {
    height: 170,
    width: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 33,
    bottom: 75,
    // backgroundColor: 'red',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FontType.SemiBold,
  },
});
