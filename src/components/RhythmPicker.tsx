import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import ScrollPicker from "./ScrollPicker";
import { FontType } from "../helpers/theme";

interface Props {
  slectedRhythm: number;
  handleRhythmSelect: (time: number) => void;
  rhythmList: number[],
}

const RhythmPicker: React.FC<Props> = ({ slectedRhythm, handleRhythmSelect, rhythmList }: Props) => {

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.text}>Breaths/Min</Text>
      <ScrollPicker
        listItems={rhythmList}
        onSelect={handleRhythmSelect}
        initialIndex={slectedRhythm}
        itemWidth={50}
        itemHeight={50}
        fontSize={37}
        isVertical={true}
      />
    </View>
  );
}
export default RhythmPicker;
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontFamily: FontType.SemiBold,
    position: 'absolute',
    bottom: 25,
    right: 20,
  },
  container: {
    height: 110,
    width: 350,
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    zIndex: 10,
  }

});
