import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Profile.styles.js';
import analytics from '@react-native-firebase/analytics';
import {useFocusEffect} from '@react-navigation/native';
import DEFAULT_IMAGE from '../../../assets/background_imges/image_6.png';
const BLANK_PROFILE =
  'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';

const Profile = () => {
  useFocusEffect(
    React.useCallback(() => {
      // will do the api call here
    }, []),
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(27,31,55,0.57)', 'rgb(27,31,56)']}
        style={styles.topRow}>
        <View style={{flex: 1}}>
          <ImageBackground
            source={DEFAULT_IMAGE}
            style={styles.backgroundImage}>
            <View
              style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{uri: BLANK_PROFILE}}
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.profileName}>Your Name</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>Today</Text>
                <Text style={styles.score}>35</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>Total</Text>
                <Text style={styles.score}>77</Text>
              </View>
              <View style={[styles.scoreContainer, {flex: 1.5}]}>
                <Text style={styles.scoreTitle}>Daily Streak</Text>
                <Text style={styles.score}>89</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
      <View style={styles.bottomRow} />
    </View>
  );
};

export default Profile;
