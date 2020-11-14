import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  Platform,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Colors, FontType} from '../helpers/theme';
import ButtonBig from '../components/ButtonBig';
import {ScreenWidth} from '../helpers/constants/common';

const BreathingSettings = ({close}) => {
  const breathing = useSelector((state) => state.breathing);
  const userInfo = useSelector((state) => state.userInfo);
  const breathingId = breathing.id;
  const dispatch = useDispatch();
  const soundStatus = userInfo[`${breathingId}_sound`];
  const vibrationStatus = userInfo[`${breathingId}_vibration`];
  const toggleSound = () => {
    dispatch({type: 'TOGGLE_SOUND', name: `${breathingId}_sound`});
  };

  const toggleVibration = () => {
    dispatch({type: 'TOGGLE_VIBRATION', name: `${breathingId}_vibration`});
  };

  console.log('sound status==>', vibrationStatus);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{breathing.name}</Text>
      <View style={styles.infoHolder}>
        <ScrollView>
          <View style={styles.infoTextPadding}>
            <Text style={styles.infoTitle}>SUMMARRY</Text>
          </View>
          <View style={styles.infoTextPadding}>
            <Text style={styles.infoText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
            </Text>
          </View>
          <View style={styles.infoTextPadding}>
            <Text style={styles.infoTitle}>TARGET RYTHMS</Text>
          </View>
          <View style={styles.infoTextPadding}>
            <Text style={styles.infoText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
            </Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleHolder}>
          <Text style={styles.toggleText}>SOUND</Text>
          <Switch
            trackColor={{false: '#252A43', true: '#252A43'}}
            thumbColor={Colors.buttonBlue}
            ios_backgroundColor="#252A43"
            onValueChange={toggleSound}
            value={soundStatus}
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.toggleHolder}>
            <Text style={styles.toggleText}>VIBRATION</Text>
            <Switch
              trackColor={{false: '#252A43', true: '#252A43'}}
              thumbColor={Colors.buttonBlue}
              ios_backgroundColor="#252A43"
              onValueChange={toggleVibration}
              value={vibrationStatus}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonHolder}>
        <ButtonBig
          title={'CLOSE'}
          containerStyle={styles.button}
          titleStyle={styles.buttonTitle}
          handlePress={close}
        />
      </View>
    </View>
  );
};
export default BreathingSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    top: 30,
  },
  buttonHolder: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: Colors.betterBlue,
  },
  buttonTitle: {
    color: Colors.buttonBlue,
  },
  infoHolder: {
    marginTop: 80,
    height: 250,
    width: 310,
    borderRadius: 10,
    backgroundColor: '#13172F',
  },
  toggleContainer: {
    height: 200,
    width: 310,
  },
  toggleHolder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
  },
  infoTitle: {
    fontFamily: FontType.SemiBold,
    fontSize: 14,
    color: 'white',
  },
  infoText: {
    fontFamily: FontType.SemiBold,
    fontSize: 12,
    color: 'white',
  },
  infoTextPadding: {
    marginTop: 10,
  },
});
