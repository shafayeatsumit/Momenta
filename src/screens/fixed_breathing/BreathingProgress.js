import React from 'react';
import {Colors} from '../../helpers/theme';
import Svg, {Circle} from 'react-native-svg';
import styles from './FixedBreathing.styles';

const size = 180;
const strokeWidth = 10;
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
  const exhaleHoldOffset = (2 * Math.PI * radius * exhaleTime) / total;
  const inhaleOffset =
    (2 * Math.PI * radius * (exhaleHold + exhaleTime)) / total;
  const inhaleHoldOffset =
    (2 * Math.PI * radius * (exhaleTime + exhaleHold + inhaleTime)) / total;

  return (
    <Svg width={size} height={size} style={styles.circleContainer}>
      <Circle
        stroke={Colors.buttonBlueDeep}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
      />

      <Circle
        stroke={Colors.betterBlueLight}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-exhaleHoldOffset}
      />
      <Circle
        stroke={Colors.buttonBlue}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-inhaleOffset}
      />
      <Circle
        stroke={Colors.betterBlueLight}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={[circumference, circumference]}
        strokeDashoffset={-inhaleHoldOffset}
      />
    </Svg>
  );
};

export default BreathingGameProgress;
