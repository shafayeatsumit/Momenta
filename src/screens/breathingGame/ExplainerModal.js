import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontType} from '../../helpers/theme';

const ExplainerModal = ({closeExplainer}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Each Momenta starts with calm breaths and then the positive emotion
            you want
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={closeExplainer}>
            <Text style={styles.okGotIT}>OK Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ExplainerModal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(27,31,55,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.4,
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
    fontSize: 22,
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
  },
  button: {
    height: 60,
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
