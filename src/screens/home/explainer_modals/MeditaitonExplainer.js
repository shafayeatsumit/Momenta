import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import Swiper from 'react-native-swiper';

const MeditationExplainer = ({closeModal}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
          <View style={{flex: 1, justifyContent: 'center', paddingBottom: 40}}>
            <Text style={styles.text}>
              You can also add mini-meditations for positive emotions to follow
              calm breathing. These are controlled in your settings
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                You can also add mini-meditations for positive emotions to
                follow calm breathing. These are controlled in your settings
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.okGotIT}>OK Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Swiper>
      </View>
    </View>
  );
};

export default MeditationExplainer;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'rgba(27,31,55,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.4,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    // justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 500,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 5,
    backgroundColor: '#3c71de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  okGotIT: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
});
