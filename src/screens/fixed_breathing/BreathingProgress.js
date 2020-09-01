import React from 'react';

import {Dimensions} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import styles from './FixedBreathing.styles';
const {width} = Dimensions.get('window');
const size = width - 50;
const strokeWidth = 20;
const {PI} = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

const BreathingGameProgress = ({
  inhaleTime,
  exhaleTime,
  inhaleHold,
  exhaleHold,
}) => {
  const total = inhaleTime + exhaleTime + inhaleHold + exhaleHold;
  const inhaleHoldOffset = (2 * Math.PI * radius * inhaleTime) / total;
  const exhaleOffset =
    (2 * Math.PI * radius * (inhaleTime + inhaleHold)) / total;
  const exhaleHoldOffset =
    (2 * Math.PI * radius * (inhaleTime + inhaleHold + exhaleTime)) / total;

  return (
    <Svg width={size} height={size} style={styles.circleContainer}>
      <Circle
        stroke="#2162cc"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
      />

      <Circle
        stroke="silver"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-inhaleHoldOffset}
      />
      <Circle
        stroke="#2162cc"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-exhaleOffset}
      />
      <Circle
        stroke="silver"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-exhaleHoldOffset}
      />
    </Svg>
  );
};

export default BreathingGameProgress;
