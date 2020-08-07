import React from 'react';
import {
  StyleSheet,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
} from 'react-native';
import {ScreenWidth} from '../../helpers/constants/common';

const TAG_IMAGE_SOURCES = {
  lovingkindness: require('../../../assets/images/lovingKindness.png'),
  reflection: require('../../../assets/images/reflection.png'),
  gratitude: require('../../../assets/images/gratitude.png'),
};

const Tag = ({selectedTags, item, handlePress}) => {
  const selectedIndex = selectedTags.findIndex(
    (selectedItem) => selectedItem === item.id,
  );
  const isSelected = selectedIndex !== -1;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={handlePress}
      style={styles.container}>
      <ImageBackground
        source={TAG_IMAGE_SOURCES[item.imageName]}
        style={styles.tile}>
        {isSelected && (
          <Image
            source={require('../../../assets/icons/checkmark.png')}
            style={styles.checkmark}
          />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Tag;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  tile: {
    width: ScreenWidth * 0.85,
    height: 95,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
    marginBottom: 16,
  },
  checkmark: {
    position: 'absolute',
    right: 15,
    height: 25,
    width: 25,
  },
});
