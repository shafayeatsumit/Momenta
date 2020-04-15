import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ScreenWidth} from '../../helpers/constants/common';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from '../../helpers/responsiveFont';

const Category = ({item, handlePress, handleLongPress, multiselectMode}) => {
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
                styles.categoryIndexHolder,
                item.orderId && {backgroundColor: 'white'},
              ]}>
              <Text style={[styles.categoryIndex, {color: textColor}]}>
                {item.orderId}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Category;

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
  categoryIndexHolder: {
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
  categoryIndex: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: RFValue(20),
    textAlign: 'center',
  },
  categoryName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: RFValue(18),
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
  },
});
