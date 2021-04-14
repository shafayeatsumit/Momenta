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
import { Exercise } from "../../redux/actions/exercise";

interface Props {
  item: any;
  handlePress: Function;
  containerStyle: any;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Thumbnail: React.FC<Props> = ({ item, containerStyle, handlePress }) => {
  const thumbnailSource = item.thumbnail;
  const displayName = capitalizeFirstLetter(item.name);

  return (

    <TouchableOpacity
      style={[styles.tiles, containerStyle]}
      activeOpacity={0.8}
      onPress={() => handlePress(item)}>

      <View style={styles.thumbContainer}>
        <ImageBackground
          source={{ uri: thumbnailSource }}
          style={styles.thumbnail}
          resizeMode={"cover"}
        >
          <Text allowFontScaling={false} style={styles.textBold}>{displayName}</Text>
        </ImageBackground>
      </View>

      <View style={styles.subHolder} >
        <Text allowFontScaling={false} style={styles.subTitle}>{item.thumbnailTitle}</Text>
      </View>
    </TouchableOpacity>

  );
};
export default Thumbnail;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 2.35,
    height: ScreenHeight / 4.5,
    marginLeft: 20,
    marginTop: 13,
    overflow: 'hidden',
  },
  title: {
    fontFamily: FontType.Bold,
    fontSize: 22,
    color: 'white',
    textAlign: 'left',
  },
  subHolder: {
    height: 35,
    justifyContent: 'center',

  },
  subTitle: {
    fontSize: 12,
    fontFamily: FontType.Regular,
    color: '#D3D3D3',
    textAlign: 'left',
    flexShrink: 1,
  },
  thumbContainer: {
    marginTop: 15,
    flex: 1,
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
    fontFamily: FontType.SemiBold,
    color: 'white',
    textAlign: 'left',
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


});
