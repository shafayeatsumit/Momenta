import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import { ScreenWidth } from '../../helpers/constants/common';
import { FontType } from '../../helpers/theme';
import { Exercise } from "../../redux/actions/exercise";

interface Props {
  exercise: Exercise;
  goToExercise: Function;
}

const Thumbnail: React.FC<Props> = ({ exercise, goToExercise }) => {
  const thumbnailSource = "file://" + exercise.thumbnailPath;
  return (

    <TouchableOpacity
      style={styles.tiles}
      activeOpacity={0.8}
      onPress={() => goToExercise(exercise)}>

      <View style={styles.thumbnailContainer}>
        <ImageBackground
          source={{ uri: thumbnailSource }}
          style={styles.thumbnail}
          resizeMode={"cover"}
        >
          <Text allowFontScaling={false} style={styles.textBold}>{exercise.displayName}</Text>
          <Text allowFontScaling={false} style={styles.level}>{exercise.level}</Text>
        </ImageBackground>
      </View>

      <View style={styles.textContainer}>
        <Text allowFontScaling={false} style={styles.title}>{exercise.thumbnailTitle}</Text>
        <Text allowFontScaling={false} style={styles.subTitle}>{exercise.thumbnailSubtitle}</Text>
      </View>
    </TouchableOpacity>

  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 2.35,
    height: ScreenWidth / 1.8,
    marginVertical: 10,
    // backgroundColor: 'red',
  },
  thumbnailContainer: {
    flex: 5,
    // backgroundColor: 'pink',
  },
  textContainer: {
    paddingTop: 8,
    flex: 2,
    padding: 5,
    // backgroundColor: 'orange',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  textBold: {
    fontSize: 20,
    position: 'absolute',
    top: 15,
    left: 15,
    fontFamily: FontType.Bold,
    color: 'white',
    textAlign: 'center',
  },
  level: {
    fontSize: 13,
    position: 'absolute',
    bottom: 15,
    left: 15,
    fontFamily: FontType.Regular,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',

  },
  title: {
    fontSize: 14,
    fontFamily: FontType.Bold,
    color: 'white',
    textAlign: 'left',
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FontType.Regular,
    color: '#D3D3D3',
    textAlign: 'left',
  }
});
