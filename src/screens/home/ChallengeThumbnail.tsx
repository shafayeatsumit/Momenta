import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import { ScreenWidth, ScreenHeight } from '../../helpers/constants';
import { FontType } from '../../helpers/theme';
import { Challenge } from "../../redux/actions/challenge";

interface Props {
  challenge: Challenge;
  goToChallenge: Function;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Thumbnail: React.FC<Props> = ({ challenge, goToChallenge }) => {
  const thumbnailSource = challenge.thumbnail;
  const displayName = capitalizeFirstLetter(challenge.name);
  const numberOfDays = challenge.numberOfDays;
  const thumbnailTitle = challenge.thumbnailTitle;
  return (

    <TouchableOpacity
      style={styles.tiles}
      activeOpacity={0.8}
      onPress={() => goToChallenge(challenge)}>

      <View style={styles.thumbnailContainer}>
        <ImageBackground
          source={{ uri: thumbnailSource }}
          style={styles.thumbnail}
          resizeMode={"cover"}
        >
          <Text allowFontScaling={false} style={styles.textBold}>{displayName}</Text>
          <Text allowFontScaling={false} style={styles.level}>{numberOfDays} Days</Text>
        </ImageBackground>
        <Text allowFontScaling={false} style={styles.subTitle}>
          {thumbnailTitle}
        </Text>
      </View>


    </TouchableOpacity>

  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 1.15,
    height: ScreenHeight / 5,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  thumbnailContainer: {
    flex: 5,
  },
  textContainer: {
    paddingTop: 8,
    flex: 1.3,
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
    lineHeight: 15,
    marginTop: 5,
    fontFamily: FontType.Regular,
    color: '#D3D3D3',
    textAlign: 'left',
  }
});
