import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";
import { triggerHaptic } from "../helpers/hapticFeedback";
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  handlePress: () => void;
}

const CalibraitonButton: React.FC<Props> = ({ handlePress }) => {
  const pressCalibrate = () => {
    triggerHaptic();
    handlePress()
    eventButtonPush('go_to_calibraiton')
  }

  return (
    <TouchableOpacity style={styles.button} onPress={pressCalibrate}>
      <Text allowFontScaling={false} style={styles.text}>Calibrate to your breathing</Text>
    </TouchableOpacity>
  );
}

export default CalibraitonButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 210,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 280,
    height: 40,
    zIndex: 15,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  }
});
