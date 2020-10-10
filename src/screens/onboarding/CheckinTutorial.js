import React from 'react';
import analytics from '@react-native-firebase/analytics';
import {ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
import {View, Text, StyleSheet} from 'react-native';
import ButtonBig from '../../components/ButtonBig';
import {useDispatch} from 'react-redux';

const CheckinTutorial = (props) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <View style={styles.centerTextHolder}>
        <Text style={styles.text}>
          Hold the screen during <Text style={styles.textBold}>exhales</Text>,
          and the exercise will adapt to your breathing.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonBig
          handlePress={() => {
            const {navigation} = props;
            const {navRoute} = props.route.params;
            navigation.replace(navRoute);
            dispatch({type: 'ONBOARDING_DONE'});
            analytics().logEvent('button_push', {title: 'I am ready'});
            console.log('button_push I am ready');
          }}
          title="I am ready"
          buttonColor={Colors.cornflowerBlue}
        />
      </View>
    </View>
  );
};
export default CheckinTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewatch: {
    alignSelf: 'center',
    // marginTop: 50,
    height: 200,
    width: 200,
    tintColor: '#787989',
    resizeMode: 'contain',
  },
  lottieContainer: {
    // marginTop: 100,
    height: 400,
    width: 330,
    // backgroundColor: 'yellow',
  },
  lottieFile: {
    alignSelf: 'center',
    marginTop: 5,
    height: 360,
    width: 320,
  },
  main: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  centerTextHolder: {
    paddingHorizontal: 30,
  },
  topTextHolder: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
  text: {
    fontFamily: FontType.Medium,
    fontSize: 23,
    color: 'white',
    lineHeight: 32,
  },
  textBold: {
    fontFamily: FontType.ExtraBold,
    fontSize: 24,
    color: Colors.cornflowerBlue,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
    width: ScreenWidth,
    height: 50,
  },
  videoContainer: {
    flex: 1,
    marginBottom: 100,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
