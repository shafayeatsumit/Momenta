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
  backgroundMusic: string | null,
  vibrationType: string | null,
  contentId?: string;
  showVibrationSettings?: boolean;

}

const Settings: React.FC<Props> = ({ contentId, vibrationType, backgroundMusic, closeModal, color, showVibrationSettings }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.spacer} />
      <View style={{ flex: 1 }} />


      <View style={styles.spacerBottom} />
      <View style={styles.closeButton}>
        <ModalButton handlePress={closeModal} >
          <Text allowFontScaling={false} style={styles.buttonText}>DONE</Text>
        </ModalButton>
      </View>

    </View>
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
