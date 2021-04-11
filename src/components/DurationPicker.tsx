import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import ScrollPicker from "./ScrollPicker";
import { FontType } from "../helpers/theme";

interface Props {
  exerciseDuration: number;
  handleTimeSelect: (time: number) => void;
  opacity: any;
  durationList?: number[],
}

const defaultDuration = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i + 1));


const DurationPicker: React.FC<Props> = ({ exerciseDuration, handleTimeSelect, opacity, durationList = defaultDuration }: Props) => {
  const initialIndex = exerciseDuration - 1;
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: 24, color: 'white', fontFamily: FontType.Medium }}>Minutes</Text>
      <ScrollPicker
        listItems={durationList}
        onSelect={handleTimeSelect}
        initialIndex={initialIndex}
        itemWidth={50}
        itemHeight={50}
        fontSize={34}
      />
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
