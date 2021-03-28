import React from 'react'
import { Animated, Text, View, StyleSheet, ViewStyle } from 'react-native';
import ScrollPicker from "./ScrollPicker";


interface Props {
  selectedMusic: string;
  handleMusicSelect: (music: string) => void;
  opacity: any;
  musicList?: string[],
  containerStyle?: ViewStyle,
}

const defaultMusic = ['swells', 'wind', 'off', 'river', 'rain'];

const MusicPicker: React.FC<Props> = ({ containerStyle, selectedMusic, handleMusicSelect, opacity, musicList = defaultMusic }: Props) => {
  let selectedMusicIndex = musicList.findIndex((item) => item === selectedMusic);

  return (
    <Animated.View style={[styles.container, containerStyle && containerStyle, { opacity }]}>
      <ScrollPicker
        listItems={musicList}
        onSelect={handleMusicSelect}
        initialIndex={selectedMusicIndex}
        itemWidth={80}
        itemHeight={50}
        fontSize={24}
      />
    </Animated.View>
  );
}
export default MusicPicker;
const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 350,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  }

});
