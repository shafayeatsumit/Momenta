import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import {ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const Thumbnail = ({
  breathingType,
  handleBreathTypeSelect,
  textStyle,
  footerText,
  middleText,
}) => {
  const hasLineOne = breathingType.name_line_one;
  return (
    <TouchableOpacity
      style={styles.tiles}
      activeOpacity={0.8}
      onPress={() => handleBreathTypeSelect(breathingType)}>
      <ImageBackground source={breathingType.image} style={styles.thumbnail}>
        {hasLineOne && (
          <Text allowFontScaling={false} style={[styles.text, textStyle]}>
            {breathingType.name_line_one}
          </Text>
        )}

        <Text allowFontScaling={false} style={styles.textBold}>
          {breathingType.name_line_two}
        </Text>
        {middleText && <Text style={styles.middleText}>{middleText}</Text>}
        {footerText && <Text style={styles.footerText}>0 days streak</Text>}
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
    fontSize: 24,
  },
  textBold: {
    fontSize: 24,
    fontFamily: FontType.ExtraBold,
    color: 'white',
    textAlign: 'center',
  },
  middleText: {
    color: 'white',
    fontFamily: FontType.SemiBold,
    fontSize: 15,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 55,
  },
  footerText: {
    color: 'white',
    fontFamily: FontType.Medium,
    fontSize: 12,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});
