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
import { GuidePractice } from "../../redux/actions/guidedPractice";
import { RootState } from "../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  content: GuidePractice;
  goToPractice: Function;
}

const Thumbnail: React.FC<Props> = ({ content, goToPractice }) => {
  const selectContentSettings = (state: RootState) => state.contentSettings;
  const contentSettings = useSelector(selectContentSettings);
  const thumbnailSource = content.thumbnail;
  const isFinished = contentSettings[content.id] ? contentSettings[content.id].isFinished : false;

  return (

    <TouchableOpacity
      style={styles.tiles}
      activeOpacity={0.8}
      onPress={() => goToPractice(content)}>

      <View style={styles.thumbnailContainer}>
        <ImageBackground
          source={{ uri: thumbnailSource }}
          style={styles.thumbnail}
          resizeMode={"cover"}
        >
          <Text allowFontScaling={false} style={styles.textBold}>{content.name}</Text>
          <Text allowFontScaling={false} style={styles.level}>{content.level}</Text>
          {/* {isFinished &&
            <View style={styles.checkmarkHolder}>
              <Image source={require('../../../assets/images/checkmark.png')} style={styles.checkmark} />
            </View>
          } */}

        </ImageBackground>
      </View>

      <View style={styles.textContainer}>
        {/* <Text allowFontScaling={false} style={styles.title}>{course.totalLessons} lessons . {course.totalDuration} minutes</Text> */}
        <Text allowFontScaling={false} style={styles.subTitle}>{content.thumbnailTitle}</Text>
      </View>
    </TouchableOpacity>

  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 1.35,
    height: ScreenWidth / 1.9,
    marginHorizontal: 10,
    // backgroundColor: 'yellow',
  },
  thumbnailContainer: {
    flex: 5,
  },
  textContainer: {
    paddingTop: 8,
    flex: 1.2,
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
    top: 18,
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
  checkmarkHolder: {
    position: 'absolute',
    bottom: 12,
    right: 15,
    height: 28,
    width: 28,
    borderRadius: 14,
    tintColor: 'white',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    height: 16,
    width: 16,
    tintColor: 'white',
    zIndex: 3,
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
