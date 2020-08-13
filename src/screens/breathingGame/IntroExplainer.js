import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import analytics from '@react-native-firebase/analytics';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import LottieView from 'lottie-react-native';

const IntroExplainer = ({closeModal}) => {
  const [showAnimation, setAnimation] = useState(false);
  const handlePress = () => {
    analytics().logEvent('button_push', {title: 'I am ready'});
    closeModal();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          Each breath is interactive. Hold screen as you inhale very slowly to
          reveal calming image. Then release to exhale slowly
        </Text>
      </View>
      <View style={styles.lottieView}>
        <LottieView
          autoPlay
          loop={false}
          autoSize={false}
          source={require('../../../assets/anims/Inhale_helper.json')}
          onAnimationFinish={() => setAnimation(true)}
        />
      </View>
      {showAnimation ? (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>I'm ready</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default IntroExplainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 250,
    alignSelf: 'center',
    height: 240,
    width: 300,
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 20,
    color: 'white',
  },

  lottieView: {
    height: 350,
    width: 350,
    bottom: ScreenHeight * 0.3,
    // backgroundColor: 'red',
    position: 'absolute',
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: ScreenHeight * 0.15,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
});
