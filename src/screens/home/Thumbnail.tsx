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
  console.log('thumbnail source', thumbnailSource)
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
          <Text style={styles.textBold}>{exercise.displayName}</Text>
        </ImageBackground>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{exercise.thumbnailTitle}</Text>
        <Text style={styles.subTitle}>{exercise.thumbnailSubtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 2.35,
    height: ScreenWidth / 1.9,
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
  title: {
    fontSize: 14,
    fontFamily: FontType.Medium,
    color: 'white',
    textAlign: 'left',
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FontType.Regular,
    color: 'white',
    textAlign: 'left',
  }
});
