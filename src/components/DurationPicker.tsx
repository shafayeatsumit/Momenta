import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import ScrollPicker from "./ScrollPicker";
import { FontType } from "../helpers/theme";

interface Props {
  exerciseDuration: number;
  handleTimeSelect: (time: number) => void;
  opacity: any;
}

const DurationPicker: React.FC<Props> = ({ exerciseDuration, handleTimeSelect, opacity }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={{ textAlign: 'center', fontSize: 24, color: 'white', fontFamily: FontType.Medium }}>Minutes</Text>
      <ScrollPicker onSelect={handleTimeSelect} initialValue={exerciseDuration} />
    </Animated.View>
  );
}
export default DurationPicker;
const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 200,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 10,
  }

});
