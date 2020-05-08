import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ScreenWidth} from '../../helpers/constants/common';
import LinearGradient from 'react-native-linear-gradient';
import {RFValue} from '../../helpers/responsiveFont';

const Tag = ({
  item,
  handlePress,
  handleLongPress,
  multiselectMode,
  selectedItems,
}) => {
  const selectedIndex = selectedItems.findIndex(
    (selectedItem) => selectedItem === item.id,
  );
  const isSelected = selectedIndex !== -1;
  const textColor = item.gradientColors[0];
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={handlePress}
      onLongPress={handleLongPress}>
      <LinearGradient
        key={item.id}
        start={{x: 0.2, y: 0}}
        end={{x: 1, y: 0}}
        colors={item.gradientColors}
        style={styles.tiles}>
        <View style={styles.iconContainer}>
          {multiselectMode && (
            <View
              style={[
                styles.tagIndexHolder,
                isSelected && styles.whiteBackground,
              ]}>
              {isSelected && (
                <Text style={[styles.tagIndex, {color: textColor}]}>
                  {selectedIndex + 1}
                </Text>
              )}
            </View>
          )}
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
    height: ScreenWidth / 3.5,
    marginVertical: 10,
    borderRadius: 7,
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
    height: RFValue(28),
    width: RFValue(28),
    borderRadius: RFValue(28) / 2,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  tagIndex: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: RFValue(20),
    textAlign: 'center',
  },
  tagName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: RFValue(18),
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
  },
});
