import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Easing,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
const {width, height} = Dimensions.get('window');

const colors = {
  black: '323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const Content = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={styles.main}>
        <FlatList
          data={timers}
          horizontal
          style={styles.flatListStyle}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          keyExtractor={(item) => item.toString()}
          renderItem={({item}) => {
            return (
              <View style={styles.textContainer}>
                <Text style={[styles.text]}>{item}</Text>
              </View>
            );
          }}
        />
      </Animated.View>
    </View>
  );
};
export default Content;

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    top: height / 3,
    left: 0,
    right: 0,
    flex: 1,
  },
  flatListStyle: {
    flexGrow: 0,
  },
  text: {
    fontSize: 80,
    color: colors.text,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_SIZE,
  },
});
