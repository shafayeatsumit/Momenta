import React from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native';
import { ScreenHeight, ScreenWidth } from "../helpers/constants";

interface Props {
  imagePath: string;
}

const ASPECT_RATIO = 640 / 732;

const BackgroundImage: React.FC<Props> = ({ imagePath }: Props) => {

  return (
    <View style={styles.backgroundImageContainer}>
      <ImageBackground source={{ uri: imagePath }} resizeMode={'cover'} style={{ aspectRatio: ASPECT_RATIO, alignSelf: 'center', height: undefined, width: '100%' }} />
    </View>
  );
}

export default BackgroundImage;

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ScreenHeight,
  },
});
