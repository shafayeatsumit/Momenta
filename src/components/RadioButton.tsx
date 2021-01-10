import React from 'react'
import { View, StyleSheet } from 'react-native';

interface Props {
  color: string;
  selected: boolean;
}

const RadioButton: React.FC<Props> = ({ color, selected }) => {
  return (
    <View style={[styles.container, { borderColor: color }]}>
      {selected && <View style={[styles.innerCircle, { backgroundColor: color }]} />}
    </View>
  );
}

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
});
