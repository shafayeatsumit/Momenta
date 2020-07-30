import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

class IntroModal extends Component {
  render() {
    const {closeModal} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.hideTheBackground}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              We’ll start with a 3{'\n'}breath meditation
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={closeModal}>
          <Text style={styles.buttonText}>I’m ready</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default IntroModal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue65,
  },
  hideTheBackground: {
    width: ScreenWidth,
    height: '60%',
    // backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    height: 200,
    width: 284,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: ScreenHeight * 0.2,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
  timeTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
