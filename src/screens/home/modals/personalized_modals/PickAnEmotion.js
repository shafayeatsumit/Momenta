import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {FontType, Colors} from '../../../../helpers/theme';
import {handleTagSelect} from '../../../../redux/actions/tag';
import {ScreenHeight} from '../../../../helpers/constants/common';
import {useSelector, useDispatch} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const PickAnEmotion = ({closeModal}) => {
  const tagNames = useSelector((state) => state.tagNames);
  const dispatch = useDispatch();
  const handleTagPress = (tagId) => {
    dispatch(handleTagSelect(tagId));
    dispatch({type: 'RESET_BREATH_COUNT'});
    closeModal();
    const nameOfTheTag = tagNames.find((tag) => tag.id === tagId).name;
    analytics().logEvent('button_push', {title: nameOfTheTag});
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          Pick a positive emotion you want to add more of in your life
        </Text>
        <Text allowFontScaling={false} style={styles.textSmall}>
          You can adjust this later
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {tagNames.map((item) => (
          <TouchableHighlight
            onPress={() => handleTagPress(item.id)}
            style={styles.button}
            key={item.id}>
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
};
export default PickAnEmotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',
    alignSelf: 'center',
    height: 170,
    width: 270,
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    width: 280,
    backgroundColor: Colors.darkBlue,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    color: 'white',
  },
  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 200,
    alignSelf: 'center',
    height: 144,
    width: 284,
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
  },
  textSmall: {
    fontFamily: FontType.Regular,
    fontSize: 14,
    color: 'white',
  },
});
