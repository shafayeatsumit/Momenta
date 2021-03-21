import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ModalButton from "../../components/ModalButton";
import { FontType } from '../../helpers/theme';
import MusicPicker from "../../components/MusicPicker";
import RhythmPicker from "../../components/RhythmPicker";
import { useDispatch, useSelector } from "react-redux";
import SoundSettings from "./Sound";
import Vibration from "./Vibration";
import { RootState } from "../../redux/reducers";
import { changeMusic } from "../../redux/actions/exerciseSettings";

interface Props {
  closeModal: () => void;
  color: string;
  backgroundMusic: string | null,
  vibrationType: string | null,
  contentId?: string;
  showVibrationSettings?: boolean;

}

const rhythmList = [1, 5, 2, 3, 4, 7, 8, 9];

const Settings: React.FC<Props> = ({ contentId, vibrationType, backgroundMusic, closeModal, color, showVibrationSettings }: Props) => {
  const dispatch = useDispatch();
  const selectSettings = (state: RootState) => state.exerciseSettings;
  const exerciseSettings = useSelector(selectSettings)
  const handleMusicSelect = (musicId: string) => {
    dispatch(changeMusic('box', musicId));
  }

  console.log(`nex settings ${JSON.stringify(exerciseSettings)}`)

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.spacer} />
      <MusicPicker selectedMusic="swells" handleMusicSelect={handleMusicSelect} opacity={1} />
      <RhythmPicker slectedRhythm={3} handleRhythmSelect={() => { }} rhythmList={rhythmList} />

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
