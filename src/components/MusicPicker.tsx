import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import ScrollPicker from "./ScrollPicker";


interface Props {
  selectedMusic: string;
  handleMusicSelect: (music: string) => void;
  opacity: any;
  musicList?: string[],
}

const defaultMusic = ['swells', 'wind', 'off', 'river', 'rain'];

const MusicPicker: React.FC<Props> = ({ selectedMusic, handleMusicSelect, opacity, musicList = defaultMusic }: Props) => {
  let selectedMusicIndex = musicList.findIndex((item) => item === selectedMusic);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
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
    top: 100,
    alignSelf: 'center',
    zIndex: 10,
  }

});
