import React, { useState, useEffect, useRef } from 'react'
import { View, Animated, Easing, Modal, StyleSheet, TouchableOpacity, Image, Text, Platform, NativeModules, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MusicPicker from "../../components/MusicPicker";
import { FontType } from '../../helpers/theme';

import RhythmPicker from "../../components/RhythmPicker";
import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";

import { startSwellExhale, startSwellInhale, stopSwellSound, playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import ExerciseTitle from "../../components/ExerciseTitle";
import { changeMusic, changeRhythm, changeVibrationType } from "../../redux/actions/exerciseSettings";

import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import { ExercisesRhythm, ScreenHeight, ScreenWidth, LottieFiles } from "../../helpers/constants";
import { BreathingState, ExerciseState } from "../../helpers/types";

import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import BreathingInstructionText from '../../components/BreathingInstructionText';

interface Props {
  name: string,
  info: string,
  primaryColor: string,
  backgroundMusic: string,
  backgroundImage: string,
  iosHapticStatus: boolean,
  selectedRhythm: any,
  vibrationType: boolean,
  appStateVisible: string,
  closeModal: () => void,
}

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

interface Progress {
  type: AnimationType | null;
  duration: number;
}
let resetting = false;

const Exercise: React.FC<Props> = ({ name, appStateVisible, vibrationType, selectedRhythm, closeModal, iosHapticStatus, info, primaryColor, backgroundMusic, backgroundImage }: Props) => {
  const dispatch = useDispatch();
  const circleProgress = useRef(new Animated.Value(0)).current;
  const totalBreathCount = useRef(0);
  const [exerciseDuration, setExerciseDuration] = useState<number>(2);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [showCircle, setShowCircle] = useState<boolean>(true);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const vibrationTypeRef = useRef(vibrationType);
  vibrationTypeRef.current = vibrationType;

  const renderCount = useRef(0);
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;

  const { inhaleTime, exhaleTime, inhaleHoldTime, exhaleHoldTime } = ExercisesRhythm[name][selectedRhythm]


  const startVibration = (duration: number) => {
    if (Platform.OS === 'android') {
      NativeModules.AndroidVibration.startVibration(duration * 1000, 20);
      return;
    }
    if (Platform.OS === 'ios') {
      NativeModules.IOSVibration.startVibration(duration);
      return;
    }
  }

  const stopVibration = () => {
    if (vibrationType === null) {
      return;
    }
    if (Platform.OS === 'android') {
      NativeModules.AndroidVibration.cancelVibration();
      return;
    }

    if (Platform.OS === 'ios' && iosHapticStatus && !__DEV__) {
      NativeModules.IOSVibration.cancelVibration();
      return;
    }
  }

  const getBreathingStateText = () => {
    switch (breathingState !== null) {
      case (breathingState === BreathingState.Inhale):
        return "Breathe in"
      case (breathingState === BreathingState.Exhale):
        return "Breathe out"
      case (breathingState === BreathingState.InhaleHold):
        return "Hold"
      case (breathingState === BreathingState.ExhaleHold):
        return "Hold"
      default:
        return ""
    }
  }

  const holdTimeEnd = () => {
    if (breathingState === BreathingState.InhaleHold) {
      startExhale();
    } else if (breathingState === BreathingState.ExhaleHold) {
      startInhale();
    }
  }


  const onStartAnimation = () => {
    Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(startExercise);
  }

  const startBackgroundMusic = () => {
    if (backgroundMusic && backgroundMusic !== 'swells') {
      playBackgroundMusic(`${backgroundMusic}.wav`);
    }
  }


  useEffect(() => {
    stopSwellSound();
    stopBackgroundMusic();
    startBackgroundMusic();
  }, [backgroundMusic])

  useEffect(() => {
    if (appStateVisible === 'background') {
      handleBack();
    }
  }, [appStateVisible])

  useEffect(() => {
    setTimeout(handleStart, 250);
    return () => {
      handleBack();
      resetting = false;
    }
  }, [])


  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(holdTimeEnd)

  let backgroundMusicRef = useRef(backgroundMusic);
  backgroundMusicRef.current = backgroundMusic;



  const exhaleEnd = () => {
    exhaleHoldTime ? startExhaleHold() : startInhale();
  }

  const startExhale = (duration = exhaleTime) => {
    totalBreathCount.current = totalBreathCount.current + 1;
    backgroundMusicRef.current === 'swells' && startSwellExhale(exhaleTime);
    Animated.timing(circleProgress, {
      toValue: 1,
      delay: inhaleHoldTime ? 0 : 400,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finished }) => {
      finished && exhaleEnd()
    });

    setBreathingState(BreathingState.Exhale)
    setProgress({ type: AnimationType.ShrinkCircle, duration })
  }

  const startInhaleHold = (duration = inhaleHoldTime) => {
    if (!resetting) {
      setBreathingState(BreathingState.InhaleHold);
      startBreathCounter(duration)
    }
  }

  const startExhaleHold = (duration = exhaleHoldTime) => {
    if (!resetting) {
      setBreathingState(BreathingState.ExhaleHold);
      startBreathCounter(duration)
    }
  }


  const inhaleEnd = () => {
    inhaleHoldTime ? startInhaleHold() : startExhale();
  }
  console.log('backgroundMusicRef ', backgroundMusicRef.current);
  const startInhale = (duration = inhaleTime) => {

    backgroundMusicRef.current === 'swells' && startSwellInhale(inhaleTime);

    vibrationTypeRef.current && startVibration(inhaleTime);
    circleProgress.setValue(0);
    setBreathingState(BreathingState.Inhale);
    Animated.timing(circleProgress, {
      toValue: 0.5,
      delay: exhaleHoldTime ? 0 : 400,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finished }) => {
      finished && inhaleEnd()
    });
  }

  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)

  }

  const handleStart = () => {
    triggerHaptic();
    startBackgroundMusic();
    onStartAnimation();
  }


  const stop = () => {
    Animated.timing(circleProgress).stop();
    fadeOutAnimation.setValue(1);
    stopVibration();
    stopBreathCounter();
    backgroundMusicRef.current === 'swells' && stopSwellSound();
    stopBackgroundMusic();
  }

  const closeInfoModal = () => {
    setInfoModalVisible(false);
    startExercise();
  }

  const handlePressInfo = () => {
    stop();
    setInfoModalVisible(true);
  }

  const handleBack = () => {
    stop();
    closeModal();
  }

  const instructionText = getBreathingStateText();
  const handleMusicSelect = (musicId: string) => {
    dispatch(changeMusic(name, musicId));
  }

  const handleRhythmSelect = (rhythm: string) => {
    dispatch(changeRhythm(name, rhythm))
  }

  const handleVibrationSelect = () => {
    dispatch(changeVibrationType(name, !vibrationType));
  }

  const rythms = ExercisesRhythm[name]
  const rhythmList = Object.keys(rythms);
  const breathsPerMin = _.get(rythms, `${selectedRhythm}.breathsPerMin`, null)

  useDidUpdateEffect(() => {
    resetting = true;
    stop();
    setTimeout(() => {
      startBackgroundMusic();
      onStartAnimation();
      resetting = false;
    }, 200)

  }, [breathsPerMin])
  const naimationFile = LottieFiles[name];

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>
      {!infoModalVisible ?
        <>

          {!resetting &&
            <>
              <View style={{ position: 'absolute', top: 0, left: 40, right: 40, bottom: 0, }}>
                <LottieView source={naimationFile} progress={circleProgress} />
              </View>

              <BreathingInstructionText totalBreathCount={totalBreathCount.current} instructionText={instructionText} count={breathCounter} />
            </>
          }



          <MusicPicker containerStyle={{ top: 45 }} selectedMusic={backgroundMusic} handleMusicSelect={handleMusicSelect} opacity={1} />
          <RhythmPicker breathsPerMin={breathsPerMin} slectedRhythm={selectedRhythm} handleRhythmSelect={handleRhythmSelect} rhythmList={rhythmList} />

          <TouchableOpacity style={styles.vibraionIconHolder} onPress={handleVibrationSelect}>
            <Image style={[styles.vibrationIcon, !vibrationType && { tintColor: '#464646' }]}
              source={
                vibrationType
                  ? require('../../../assets/images/vibration.png')
                  : require('../../../assets/images/vibration_off.png')}
            />
          </TouchableOpacity>
          <ExerciseTitle title="configure" opacity={1} />

          <BackButton handlePress={handleBack} opacity={1} />
          <ExerciseInfo opacity={1} handlePress={handlePressInfo} />

        </>
        :
        <Modal
          animationType="fade"
          transparent={true}
          visible={infoModalVisible}
          onRequestClose={closeInfoModal}
        >
          <InfoModal
            title={name} info={info} handleClose={closeInfoModal}
          />
        </Modal>

      }
    </ImageBackground>

  );
}

export default Exercise;

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