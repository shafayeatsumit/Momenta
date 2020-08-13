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
        {/* <Text style={styles.text} allowFontScaling={false}>
          Hold as you inhale slowly. Then release to exhale.
        </Text> */}
      </View>
      <View style={styles.lottieView}>
        <LottieView
          autoPlay
          loop
          autoSize={false}
          source={require('../../../assets/anims/inhale_exhale_helper.json')}
          // onAnimationFinish={() => setAnimation(true)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>I'm ready</Text>
      </TouchableOpacity>
    </View>
  );
};
export default IntroExplainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.1 + 70 + 400,
    alignSelf: 'center',
    height: 240,
    width: 300,
    marginTop: 20,
    // justifyContent: 'space-around',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 20,
    color: 'white',
    lineHeight: 30,
  },

  lottieView: {
    height: 500,
    width: 400,
    bottom: ScreenHeight * 0.1 + 100,
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
    bottom: ScreenHeight * 0.1,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
});
