import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FontType, Colors} from '../../../../helpers/theme';
import {ScreenWidth, ScreenHeight} from '../../../../helpers/constants/common';

class LetsStart extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text} allowFontScaling={false}>
            Let’s personalize your{'\n'}experience
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.props.goNext}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default LetsStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    height: 200,
    width: 284,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // // backgroundColor: 'red',
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 100,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
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
});
