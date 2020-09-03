import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');
const size = width - 50;
const strokeWidth = 20;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;
import {FontType, Colors} from '../../helpers/theme';

class CheckinProgress extends Component {
  render() {
    const {
      measuring,
      measurementType,
      instructionText,
      breathCount,
    } = this.props;
    const offset = (circumference * breathCount) / 2;
    return (
      <>
        <Svg width={size} height={size} style={styles.circleContainer}>
          <Circle
            stroke="rgba(33,98,204,0.1)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={[circumference, circumference]}
          />
          <Circle
            stroke="#2162cc"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={[circumference, circumference]}
            strokeDashoffset={circumference - offset}
          />
        </Svg>
        {measuring && (
          <View style={[styles.textContainer]}>
            <Text style={styles.textMd}>Measuring {measurementType}</Text>
            <LottieView
              autoSize
              autoPlay
              loop
              style={styles.wave}
              source={require('../../../assets/anims/wave.json')}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.text}>{instructionText}</Text>
        </View>
      </>
    );
  }
}
export default CheckinProgress;

const styles = StyleSheet.create({
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
    transform: [{rotateZ: '270deg'}],
  },
  wave: {
    height: 180,
    width: 180,
    marginTop: -20,
    // backgroundColor: 'yellow',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 60,
  },
  textMd: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
});
