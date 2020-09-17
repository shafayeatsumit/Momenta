import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {ScreenHeight} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
import analytics from '@react-native-firebase/analytics';
import LottieView from 'lottie-react-native';

const IntroFlow = (props) => {
  const [showSurvey, setSurvey] = useState(false);
  const handlePress = (goal) => {
    analytics().logEvent('button_push', {title: goal});
    props.navigation.replace('Home');
  };
  if (showSurvey) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text} allowFontScaling={false}>
            How much experience do you have with breathing exercises and
            techniques?
          </Text>
          <Text style={styles.textSmall} allowFontScaling={false}>
            This is helps to tailor your experience
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.cornflowerBlue}
            onPress={() => handlePress('lots_of_experience')}>
            <Text style={styles.buttonText}>Lots of experience</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.cornflowerBlue}
            onPress={() => handlePress('some_experience')}>
            <Text style={styles.buttonText}>Some experience</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.cornflowerBlue}
            onPress={() => handlePress('very_little')}>
            <Text style={styles.buttonText}>Very little</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Colors.cornflowerBlue}
            onPress={() => handlePress('almost_none')}>
            <Text style={styles.buttonText}>Almost none</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.textAnimation}>
        <LottieView
          autoPlay
          loop={false}
          resizeMode="contain"
          source={require('../../../assets/anims/intro_text.json')}
          onAnimationFinish={() => setSurvey(true)}
        />
      </View>
    </View>
  );
};
export default IntroFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAnimation: {
    height: 350,
    width: 350,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',
    alignSelf: 'center',
    height: 230,
    width: 270,
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    width: 280,
    backgroundColor: Colors.betterBlueLight,
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
    bottom: ScreenHeight * 0.2 + 250,
    alignSelf: 'center',
    height: 200,
    width: 284,
    justifyContent: 'space-around',
    // backgroundColor: 'red',
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
