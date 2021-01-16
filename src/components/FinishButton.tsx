import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontType } from "../helpers/theme";

interface Props {
  handleFinish: () => void;
  color: string;
}



const Timer: React.FC<Props> = ({ handleFinish, color }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={handleFinish}>
      <Text style={[styles.text, { color: color }]}>FINISH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 85,
    right: 25,
    height: 40,
    // width: 70,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontFamily: FontType.Medium,
    color: 'white',

  }

});

export default Timer;