import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import styles from './CalmBreathingChallenge.styles';
import analytics from '@react-native-firebase/analytics';

const MindfulChallenge = ({navigation}) => {
  const breathing = useSelector((state) => state.breathing);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const goBack = () => navigation.goBack();

  const handleSignup = () => {
    dispatch({type: 'SIGNED_UP_CALM_BREATHING_CHALLENGE'});
    analytics().logEvent('button_push', {title: 'signed_up_calm_challenge'});
  };
  const {signedUpCalmBreathingChallenge: isSignedUp} = userInfo;
  const buttonTitle = isSignedUp ? 'Signed Up' : 'Sign Up';
  return (
    <ImageBackground source={breathing.background} style={styles.background}>
      <View style={styles.titleBox}>
        <Text style={styles.titleSm}>{breathing.name_line_one}</Text>
        <Text style={styles.title}>{breathing.name_line_two}</Text>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{breathing.description}</Text>
      </View>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={goBack}>
        <Image
          source={require('../../../assets/icons/arrow_left.png')}
          style={styles.backbutton}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignup}
        disabled={isSignedUp}
        style={[
          styles.button,
          styles.buttonBlue,
          isSignedUp && {backgroundColor: '#787989'},
        ]}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};
export default MindfulChallenge;
