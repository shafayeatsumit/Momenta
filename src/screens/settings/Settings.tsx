import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ModalButton from "../../components/ModalButton";
import { FontType } from '../../helpers/theme';

import SoundSettings from "./Sound";
import Vibration from "./Vibration";

interface Props {
  closeModal: () => void;
  color: string;
  showVibrationSettings?: boolean;
}

const Settings: React.FC<Props> = ({ closeModal, color, showVibrationSettings }: Props) => {
  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.94, y: 0.6 }}
      colors={['#353B47', '#0A120B']}
      style={{ flex: 1 }}
    >
      <View style={styles.spacer} />
      <Text allowFontScaling={false} style={styles.settings}>Settings</Text>

      <SoundSettings color={color} />
      {showVibrationSettings && <Vibration color={color} />}


      <View style={styles.spacerBottom} />
      <View style={styles.closeButton}>
        <ModalButton handlePress={closeModal} >
          <Text allowFontScaling={false} style={styles.buttonText}>DONE</Text>
        </ModalButton>
      </View>

    </LinearGradient>
  );
}

export default Settings;

const styles = StyleSheet.create({
  spacer: {
    height: 40,
  },
  spacerBottom: {
    height: 80
  },
  settings: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
    fontFamily: FontType.Bold,
  },
  closeButton: {
    position: 'absolute',
    height: 50,
    width: 80,
    bottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#979797',
    fontFamily: FontType.Medium,
    fontSize: 20,
  }

});
