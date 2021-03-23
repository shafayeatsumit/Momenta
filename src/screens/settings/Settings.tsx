import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ModalButton from "../../components/ModalButton";
import { FontType } from '../../helpers/theme';
import MusicPicker from "../../components/MusicPicker";
import BackButton from "../../components/BackButton";
import RhythmPicker from "../../components/RhythmPicker";
import { useDispatch, useSelector } from "react-redux";
import SoundSettings from "./Sound";
import Vibration from "./Vibration";
import { RootState } from "../../redux/reducers";
import { changeMusic, changeRhythm, changeVibrationType } from "../../redux/actions/exerciseSettings";

import _ from 'lodash';

interface Props {
  closeModal: () => void;
  vibrationType: boolean,
  backgroundMusic: string,
  exerciseName: string;
  selectedRhythm: string;
}

const RhythmListAll = {
  'calm': {
    'standard': { inhaleTime: 5, exhaleTime: 5, breathsPerMin: 6 },
    'faster': { inhaleTime: 3.5, exhaleTime: 3.5, breathsPerMin: 8 },
    'slower': { inhaleTime: 3, exhaleTime: 3, breathsPerMin: 10 },
  },
  'box': {
    'standard': { inhaleTime: 4, exhaleTime: 4, inhaleHoldTime: 4, exhaleHoldTime: 4, breathsPerMin: 4 },
    'faster': { inhaleTime: 3, exhaleTime: 3, inhaleHoldTime: 3, exhaleHoldTime: 3, breathsPerMin: 5 },
    'slower': { inhaleTime: 2.5, exhaleTime: 2.5, inhaleHoldTime: 2.5, exhaleHoldTime: 2.5, breathsPerMin: 6 },
  }
}

const Settings: React.FC<Props> = ({ selectedRhythm, exerciseName, vibrationType, backgroundMusic, closeModal, }: Props) => {
  const dispatch = useDispatch();
  const selectSettings = (state: RootState) => state.exerciseSettings;
  const exerciseSettings = useSelector(selectSettings)
  const handleMusicSelect = (musicId: string) => {
    dispatch(changeMusic(exerciseName, musicId));
  }

  const handleRhythmSelect = (rhythm: string) => {
    dispatch(changeRhythm(exerciseName, rhythm))
  }

  const handleVibrationSelect = () => {
    dispatch(changeVibrationType(exerciseName, !vibrationType));
  }

  const rythms = RhythmListAll[exerciseName]
  const rhythmList = Object.keys(rythms);
  const breathsPerMin = _.get(rythms, `${selectedRhythm}.breathsPerMin`, null)


  return (
    <View style={{ flex: 1 }}>

      <BackButton handlePress={closeModal} opacity={1} />
      <MusicPicker selectedMusic={backgroundMusic} handleMusicSelect={handleMusicSelect} opacity={1} />
      <RhythmPicker breathsPerMin={breathsPerMin} slectedRhythm={selectedRhythm} handleRhythmSelect={handleRhythmSelect} rhythmList={rhythmList} />

      <TouchableOpacity style={styles.vibraionIconHolder} onPress={handleVibrationSelect}>
        <Image style={styles.vibrationIcon}
          source={
            vibrationType ? require('../../../assets/images/vibration.png')
              : require('../../../assets/images/vibration_off.png')}
        />
      </TouchableOpacity>


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
  },
  vibraionIconHolder: {
    position: 'absolute',
    bottom: 90,
    left: 60,
  },
  vibrationIcon: {
    height: 32, width: 32, tintColor: 'white', resizeMode: 'contain'
  },
});
