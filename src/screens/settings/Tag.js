import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import LinearGradient from 'react-native-linear-gradient';
import {RFValue} from '../../helpers/responsiveFont';
import checkIcon from '../../../assets/icons/check_icon.png';
import {FontType} from '../../helpers/theme';

const Tag = ({selectedTags, item, handlePress}) => {
  const selectedIndex = selectedTags.findIndex(
    (selectedItem) => selectedItem === item.id,
  );
  const isSelected = selectedIndex !== -1;
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
      <LinearGradient
        key={item.id}
        start={{x: 0.2, y: 0}}
        end={{x: 1, y: 0}}
        colors={item.gradientColors}
        style={styles.tiles}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.tagIndexHolder,
              isSelected && styles.whiteBackground,
            ]}>
            {isSelected && <Image source={checkIcon} style={styles.tagIndex} />}
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.tagName}>{item.name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tiles: {
    width: ScreenWidth / 2.4,
    height: ScreenHeight / 6.2,
    marginVertical: 10,
    borderRadius: 10,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5,
  },
  tagIndexHolder: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBackground: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  tagIndex: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
  },
  tagName: {
    fontFamily: FontType.SemiBold,
    fontSize: 15,
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
  },
});
