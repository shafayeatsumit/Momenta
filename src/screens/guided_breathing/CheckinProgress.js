import React, {Component} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import LottieView from 'lottie-react-native';

const size = 180;
const strokeWidth = 10;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;
import {Colors} from '../../helpers/theme';

class CheckinProgress extends Component {
  render() {
    const {breathCount} = this.props;
    const offset = (circumference * breathCount) / 2;
    return (
      <>
        <Svg width={size} height={size} style={styles.circleContainer}>
          <Circle
            stroke={Colors.betterBlueLight}
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
});
