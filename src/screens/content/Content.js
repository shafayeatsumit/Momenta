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
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleCircumference = 2 * Math.PI * 150;
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.animatedOffSet = new Animated.Value(CircleCircumference);
    this.animatedRadius = new Animated.Value(75);
  }

  animate = () => {
    Animated.parallel([
      Animated.timing(this.animatedOffSet, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedRadius, {
        toValue: 148,
        duration: 3000,
        useNativeDriver: true,
      }),
      ,
    ]).start();
  };

  componentDidMount() {
    this.animate();
  }

  render() {
    const circleCircumference = 2 * Math.PI * 150;
    const strokeDashoffset =
      circleCircumference - (circleCircumference * 99) / 100;
    console.log(`strokeDashoffset ${strokeDashoffset}`);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Building your{'\n'}
          exercise
        </Text>

        <View style={styles.svgHolder}>
          <Svg height="100%" width="100%" style={styles.svg}>
            <G rotation="-90" origin={('150', '150')}>
              <AnimatedCircle
                cx="145"
                cy="155"
                r="150"
                stroke="#447d70"
                strokeWidth="2"
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <AnimatedCircle
                cx="145"
                cy="155"
                r={this.animatedRadius}
                strokeWidth="0"
                fill={Colors.cornflowerBlue}
                strokeDasharray={circleCircumference}
                strokeDashoffset={this.animatedOffSet}
              />
              <Circle
                cx="145"
                cy="155"
                r="75"
                strokeWidth="0"
                fill={'#13172f'}
                strokeDasharray={circleCircumference}
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
    height: 310,
    width: 310,
    marginBottom: 20,
    alignItems: 'center',
  },
  svg: {
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FontType.Medium,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
    paddingBottom: 12,
  },
});
