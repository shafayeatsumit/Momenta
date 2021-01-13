import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScreenWidth } from '../helpers/constants/common';

interface Props {
  color: string;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

const BullsEye: React.FC<Props> = ({ color, handlePressIn, handlePressOut }: Props) => {

  return (
    <TouchableOpacity style={styles.main} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Svg width="300" height="250" viewBox="0 0 240 240">
        <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
          <G fill={color} transform="translate(-85 -565)">
            <G transform="translate(85 565)">
              <Circle cx="125" cy="125" r="125" opacity="0.08" />
              <Circle cx="125" cy="125" r="90" opacity="0.159" />
              <Circle cx="125.5" cy="125.5" r="50" />
            </G>
          </G>
        </G>
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    height: 220,
    width: ScreenWidth,
    position: 'absolute',
    bottom: -103,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BullsEye;
