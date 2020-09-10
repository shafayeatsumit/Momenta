import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import styles from './BreathingGame.styles';
import {Colors} from '../../helpers/theme';
const size = 180;
const strokeWidth = 10;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

const BreathingGameProgress = ({inhaleTime, exhaleTime}) => {
  const strokeoffset =
    (2 * Math.PI * radius * exhaleTime) / (inhaleTime + exhaleTime);
  return (
    <Svg width={size} height={size} style={styles.circleContainer}>
      <Circle
        stroke={Colors.buttonBlue}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
      />

      <Circle
        stroke={Colors.buttonBlueDeep}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-strokeoffset}
      />
    </Svg>
  );
};

export default BreathingGameProgress;
