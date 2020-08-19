import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {ScreenHeight} from '../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';
import CommonStyles from './Onboarding.styles';

const Reason = ({goNext}) => {
  const [activeButton, setActiveButton] = useState(null);

  const handlePress = (goal) => {
    analytics().logEvent('button_push', {title: goal});
    setActiveButton(goal);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          When could you use Momenta:
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={[
            styles.button,
            activeButton === 'When_I_need_a_break' && styles.buttonActive,
          ]}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('When_I_need_a_break')}>
          <Text style={styles.buttonText}>When I need a break</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.button,
            activeButton === 'Before_bed' && styles.buttonActive,
          ]}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('Before_bed')}>
          <Text style={styles.buttonText}>Before bed</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.button,
            activeButton === 'As_I_watch_TV' && styles.buttonActive,
          ]}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('As_I_watch_TV')}>
          <Text style={styles.buttonText}>As I watch TV</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.button,
            activeButton === 'Instead_of_social_media' && styles.buttonActive,
          ]}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('Instead_of_social_media')}>
          <Text style={styles.buttonText}>Instead of social media</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.button,
            styles.finishButton,
            activeButton && {
              backgroundColor: Colors.cornflowerBlue,
            },
          ]}
          underlayColor={Colors.cornflowerBlue}
          disabled={activeButton === null}
          onPress={goNext}>
          <Text style={styles.buttonText}>Finish Setup</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};
export default Reason;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',
    alignSelf: 'center',
    height: 300,
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
  buttonActive: {
    backgroundColor: Colors.cornflowerBlue,
  },
  finishButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    color: 'white',
  },
  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 280,
    alignSelf: 'center',
    height: 240,
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
