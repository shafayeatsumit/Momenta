import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";

interface Props {
  handlePress: () => void;
}

const CalibraitonButton: React.FC<Props> = ({ handlePress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Calibrate to your breathing</Text>
    </TouchableOpacity>
  );
}

export default CalibraitonButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 170,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 40,
    zIndex: 15,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    textAlign: 'center',
    color: '#AAAAAA',
  }
});
