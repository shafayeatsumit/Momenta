import React, {useState, useEffect} from 'react';
import {Animated, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default () => {
  const [fadeAnimCategory] = useState(new Animated.Value(0));
  const [fadeAnimContent] = useState(new Animated.Value(0));

  const fadeInAnim = () => {
    Animated.parallel([
      Animated.timing(fadeAnimCategory, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimContent, {
        toValue: 1,
        duration: 5000,
        delay: 3500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Animated.Text
        style={{
          fontSize: 28,
          paddingVertical: 10,
          textAlign: 'center',
          opacity: fadeAnimCategory,
        }}>
        Fading in
      </Animated.Text>

      <Animated.Text
        style={{
          fontSize: 20,
          paddingBottom: 10,
          textAlign: 'center',
          opacity: fadeAnimContent,
        }}>
        Now content will fade in
      </Animated.Text>

      <TouchableOpacity
        onPress={fadeInAnim}
        style={{
          alignSelf: 'center',
          height: 100,
          width: 100,
          backgroundColor: 'red',
        }}
      />
    </View>
  );
};
