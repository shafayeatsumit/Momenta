import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
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
      <ImageBackground
        source={{ uri: thumbnailSource }}

        style={styles.thumbnail}
        resizeMode="contain"
      >
        <Text style={styles.textBold}>{exercise.name}</Text>
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
  textBold: {
    fontSize: 24,
    fontFamily: FontType.ExtraBold,
    color: 'white',
    textAlign: 'center',
  },
});
