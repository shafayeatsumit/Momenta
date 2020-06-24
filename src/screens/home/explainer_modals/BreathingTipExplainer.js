import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import Swiper from 'react-native-swiper';

const BreathingTipExplainer = ({closeModal}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
          <View style={styles.main}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                You’ll receive breathing tips based on the latest science and
                yoga practices to help make you calmer. Eventually, they will
                become habit.
              </Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            <View style={[styles.textContainer]}>
              <Text style={styles.text}>
                You can control breathing tips in settings and read more about
                the health benefits in FAQ
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

export default BreathingTipExplainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
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
    height: 500,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
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
    flex: 1,
    justifyContent: 'center',
    // alignItems:'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
