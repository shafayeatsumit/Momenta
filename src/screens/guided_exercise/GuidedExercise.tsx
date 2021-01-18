import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, View, Modal, NativeModules, Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { triggerHaptic } from "../../helpers/hapticFeedback";
import useTimer from "../../hooks/useTimer";
import Calibraiton from "../../screens/calibration/Calibration";
import CalibrationComplete from "../../components/CalibrationComplete";
import CalibraitonButton from "../../components/CalibrationButton";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import Settings from '../settings/Settings';
import ProgressBar from "../../components/ProgressBar";
import BreathingProgress from "../../components/BreathingProgress";
import FinishButton from "../../components/FinishButton";
import BackgroundImage from "../../components/BackgroundImage";
import BackgroundCircle from "../../components/BackgroundCircle"
import Timer from "../../components/Timer";
import DurationPicker from "../../components/DurationPicker";
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import ExerciseTitle from "../../components/ExerciseTitle";
import SettingsButton from "../../components/SettingsButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import TapHandler from "../../components/TapHandler";
import BreathingInstruction from "../../components/BreathingInstructionText";
import { startSwellExhale, startSwellInhale, stopSwellSound, playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';


interface Props {
  navigation: any;
  route: RouteProp<any, any>;
}

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

interface Progress {
  type: AnimationType | null;
  duration: number;
}


const avgTime = (breathingTime: number, targetTime: number) =>
  (breathingTime + targetTime) / 2;

let inhaleTime = 0;
let exhaleTime = 0;
let totalBreathCount = 0;


const GuidedExercise: React.FC<Props> = ({ navigation, route }: Props) => {
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const selectSettings = (state: RootState) => state.settings;
  const allBackgroundMusic = useSelector(selectBackgroundMusic);
  const settings = useSelector(selectSettings)
  const { backgroundMusic, vibrationType } = settings;
  const exerciseData = route.params.exercise;

  const {
    calibrationInhale, calibrationExhale, targetInhale, targetExhale, targetDuration, primaryColor,
    displayName, backgroundImagePath, backgroundGradient, about, tips,
  } = exerciseData;

  const [calibration, setCalibration] = useState<{ inhale: number, exhale: number }>({ inhale: calibrationInhale, exhale: calibrationExhale })

  const hasSwell = backgroundMusic === 'swell';
  const hasBackgroundMusic = backgroundMusic !== 'swell' && backgroundMusic !== null;

  const avgExhale = avgTime(calibration.exhale, targetExhale);
  const avgInhale = avgTime(calibration.inhale, targetInhale);
  const targetBreathCount = Math.ceil(targetDuration / (avgInhale + avgExhale));
  const exhaleIncrement = (targetExhale - calibration.exhale) / targetBreathCount;
  const inhaleIncrement = (targetInhale - calibration.inhale) / targetBreathCount;
  if (!inhaleTime) {
    inhaleTime = calibration.inhale + inhaleIncrement;
  }

  if (!exhaleTime) {
    exhaleTime = calibration.exhale + exhaleIncrement;
  }




  const [exerciseDuration, setExerciseDuration] = useState<number>(2);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [iosHapticStatus, setIOSHapticStatus] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [calibrationModalVisible, setCalibrationModalVisible] = useState<boolean>(false);
  const [calibrationComplete, setCalibrationComplete] = useState<boolean>(false);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  const renderCount = useRef(0);
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;

  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;
  const exerciseFinished = exerciseState === ExerciseState.Finish;
  const showTimer = isPaused || exerciseFinished || optionsVisible;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;

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

  const onStartAnimation = () => {
    Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(startExercise);
  }

  const startBackgroundMusic = () => {
    const notEmpty = !_.isEmpty(allBackgroundMusic)
    if (notEmpty) {
      const music = allBackgroundMusic[backgroundMusic]
      playBackgroundMusic(music.filePath)
    }
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  useEffect(() => {
    if (Platform.OS === 'ios') {
      NativeModules.IOSVibration.getHapticStatus((error: any, resp: boolean) => {
        setIOSHapticStatus(resp)
        if (resp) NativeModules.IOSVibration.prepareHaptics();
      });
    }
    return () => {
      inhaleTime = 0;
      exhaleTime = 0;
      totalBreathCount = 0;
    };
  }, [])

  const timerEnd = () => {
    setExerciseState(ExerciseState.Finish);
  }

  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const startExhale = (duration = exhaleTime) => {
    setBreathingState(BreathingState.Exhale)
    vibrationType === 'purr_exhale' && startVibration(exhaleTime);
    hasSwell && startSwellExhale(exhaleTime);
    setProgress({ type: AnimationType.ShrinkCircle, duration })
  }

  const exhaleEnd = () => {
    totalBreathCount = totalBreathCount + 1;
    const noIncrement = totalBreathCount > targetBreathCount;
    if (noIncrement) {
      startInhale();
    } else {
      exhaleTime = exhaleTime + exhaleIncrement;
      inhaleTime = inhaleTime + inhaleIncrement;
      startInhale();
    }
  }

  const inhaleEnd = () => {
    startExhale();
  }

  const startInhale = (duration = inhaleTime) => {
    setBreathingState(BreathingState.Inhale);
    hasSwell && startSwellInhale(inhaleTime);
    vibrationType === 'purr_inhale' && startVibration(inhaleTime);
    setProgress({ type: AnimationType.ExpandCircle, duration })
  }

  const updateCalibrationData = (calibInhale: number, calibExhale: number) => {
    const updatedInhaleTime = Math.max(calibExhale, 3);
    const updatedExhaleTime = calibExhale;
    setCalibration({
      exhale: updatedExhaleTime,
      inhale: updatedInhaleTime,
    })
    inhaleTime = updatedInhaleTime;
    exhaleTime = updatedExhaleTime;
    setCalibrationComplete(true);
    closeCalibrationModal();
  }

  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)
    startTimer();
  }

  const handleStart = () => {
    triggerHaptic();
    hasBackgroundMusic && startBackgroundMusic();
    onStartAnimation();
  }

  const stop = () => {
    stopTimer();
    stopVibration();
    hasBackgroundMusic && stopBackgroundMusic();
    hasSwell && stopSwellSound();
    fadeOutAnimation.setValue(1)
  }

  const handlePause = () => {
    setExerciseState(ExerciseState.Paused)
    stop();
  }

  const handleTap = () => {
    if (exerciseState === ExerciseState.Play) {
      showOptions();
    }
  }
  const showOptions = () => {
    if (!optionsVisible) {
      setOptionsVisible(true);
      hideOptions();
    }
  }

  const hideOptions = () => {
    console.log('+++++ hiding options +++++++')
    Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 300,
      delay: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setOptionsVisible(false));
  }

  const handlePressSettings = () => {
    if (exerciseNotStarted) {
      stop();
    } else if (!isPaused) {
      handlePause();
    }

    setSettingsVisible(true);
  }
  const closeSetting = () => setSettingsVisible(false);
  const closeInfoModal = () => setInfoModalVisible(false);
  const closeCalibrationModal = () => setCalibrationModalVisible(false);

  const handlePressInfo = () => {
    if (exerciseNotStarted) {
      stop();
    } else if (!isPaused) {
      handlePause();
    }
    setInfoModalVisible(true);
  }

  const handleFinish = () => {
    triggerHaptic();
    stop();
    navigation.goBack()
  }

  const goToCalibration = () => setCalibrationModalVisible(true);
  const handleBack = () => {
    !isPaused && stop();
    navigation.goBack()
  }

  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.05, y: 0.95 }}
      colors={backgroundGradient}
      style={{ flex: 1 }}
    >
      <BackgroundImage imagePath={backgroundImagePath} />
      {isStopped && <BackgroundCircle opacity={fadeOutAnimation} />}

      {showTimer && <Timer time={time} exerciseDuration={exerciseDuration} />}
      {exerciseNotStarted &&
        <>

          {calibrationComplete
            ? <CalibrationComplete calibrationComplete={calibrationComplete} />
            : <CalibraitonButton handlePress={goToCalibration} />
          }
          <DurationPicker exerciseDuration={exerciseDuration} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />
        </>
      }



      {(isStopped || optionsVisible) &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <ExerciseTitle title={displayName} opacity={fadeOutAnimation} />
          <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />
        </>
      }
      <BreathingProgress primaryColor={primaryColor} progress={progress} exerciseState={exerciseState} exhaleEnd={exhaleEnd} inhaleEnd={inhaleEnd} />
      { (!isPaused && !optionsVisible) && <BreathingInstruction totalBreathCount={totalBreathCount} breathingState={breathingState} exerciseNotStarted={exerciseNotStarted} />}

      <TapHandler handleTap={handleTap} />
      { isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      { showPause && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}
      { exerciseFinished && <FinishButton color={primaryColor} handleFinish={handleFinish} />}
      <ProgressBar duration={exerciseDuration} time={time} color={primaryColor} showProgressBar={showProgressBar} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}

      >
        <Settings closeModal={closeSetting} color={primaryColor} />
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={closeInfoModal}
      >
        <InfoModal
          title={displayName} about={about} tips={tips} handleClose={closeInfoModal}
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={calibrationModalVisible}
        onRequestClose={closeCalibrationModal}
      >
        <Calibraiton
          primaryColor={primaryColor}
          displayName={displayName}
          backgroundImagePath={backgroundImagePath}
          backgroundGradient={backgroundGradient}
          closeModal={closeCalibrationModal}
          updateCalibrationData={updateCalibrationData}
        />
      </Modal>
    </LinearGradient >
  );
}

export default GuidedExercise;