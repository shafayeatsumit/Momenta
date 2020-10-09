import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {Colors, FontType} from '../../helpers/theme';

const Thumbnail = ({breathingType, handleBreathTypeSelect}) => {
  return (
    <TouchableOpacity
      style={styles.tiles}
      activeOpacity={0.8}
      onPress={() => handleBreathTypeSelect(breathingType)}>
      <ImageBackground source={breathingType.image} style={styles.thumbnail}>
        <Text style={styles.text}>{breathingType.name_line_one}</Text>
        <Text style={styles.textBold}>{breathingType.name_line_two}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 2.4,
    height: ScreenWidth / 1.65,
    marginVertical: 10,
    borderRadius: 7,
    overflow: 'hidden',
  },
  thumbnail: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: FontType.BradleyBold,
    fontSize: 22,
  },
  textBold: {
    fontSize: 22,
    fontFamily: FontType.ExtraBold,
    color: 'white',
    textAlign: 'center',
  },
});
