import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, Modal, Platform, NativeModules, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import Settings from '../settings/Settings';
import { startSwellExhale, startSwellInhale, stopSwellSound, playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import ProgressBar from '../../components/ProgressBar';
import BreathingProgress from "../../components/BreathingProgress";
import BackgroundImage from "../../components/BackgroundImage";
import BackgroundCircle from "../../components/BackgroundCircle"
import FinishButton from "../../components/FinishButton";
import Timer from "../../components/Timer";
import DurationPicker from "../../components/DurationPicker";
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import ExerciseTitle from "../../components/ExerciseTitle";
import SettingsButton from "../../components/SettingsButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import BreathCounter from "../../components/BreathCounter";
import TapHandler from "../../components/TapHandler";
import BreathingInstruction from "../../components/BreathingInstructionText";
import { ExercisesRhythm } from "../../helpers/constants";
import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import _ from 'lodash';

interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

interface Progress {
  type: AnimationType | null;
  duration: number;
}




const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const selectSettings = (state: RootState) => state.exerciseSettings;
  const settingsInfo = useSelector(selectSettings)

  const [exerciseDuration, setExerciseDuration] = useState<number>(2);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [iosHapticStatus, setIOSHapticStatus] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  const renderCount = useRef(0);

  const fadeOutAnimation = useRef(new Animated.Value(1)).current;


  const { name, about, tips, primaryColor, displayName, defaultMusic, backgroundImage } = route.params.exercise;
  const backgroundMusic = _.get(settingsInfo, `${name}.backgroundMusic`, defaultMusic);
  const selectedRhythm = _.get(settingsInfo, `${name}.rhythm`, 'standard');
  const vibrationType = _.get(settingsInfo, `${name}.vibrationType`, true);
  const { inhaleTime, exhaleTime, inhaleHoldTime, exhaleHoldTime } = ExercisesRhythm[name][selectedRhythm]
  console.log('inhale time', inhaleTime, exhaleTime, inhaleHoldTime, exhaleHoldTime);

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

  const breathCountEnd = () => {
    switch (breathingState !== 0) {
      case (breathingState === BreathingState.Inhale):
        inhaleHoldTime ? startInhaleHold() : startExhale();
        return
      case (breathingState === BreathingState.Exhale):
        exhaleHoldTime ? startExhaleHold() : startInhale();
        return
      case (breathingState === BreathingState.InhaleHold):
        startExhale();
        return
      case (breathingState === BreathingState.ExhaleHold):
        startInhale();
        return
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
    if (backgroundMusic) {
      playBackgroundMusic(`${backgroundMusic}.wav`);
    }
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  useEffect(() => {
    if (settingsVisible) {
      stopBackgroundMusic();
      startBackgroundMusic();
    }
  }, [backgroundMusic])


  useEffect(() => {
    if (Platform.OS === 'ios') {
      NativeModules.IOSVibration.getHapticStatus((error: any, resp: boolean) => {
        setIOSHapticStatus(resp)
        if (resp) NativeModules.IOSVibration.prepareHaptics();
      });
    }
  }, [])

  const timerEnd = () => {
    setExerciseState(ExerciseState.Finish);
  }

  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(breathCountEnd)
  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)
  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;

  const exerciseFinished = exerciseState === ExerciseState.Finish;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;
  const hasSwell = backgroundMusic === 'swells';
  const hasBackgroundMusic = backgroundMusic !== 'swells' && backgroundMusic !== null;

  const showBackgroundCircle = (isStopped || isPaused);

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const exhaleEnd = () => {

  }

  const startExhale = (duration = exhaleTime) => {
    hasSwell && startSwellExhale(exhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Exhale)
    setProgress({ type: AnimationType.ShrinkCircle, duration })
  }

  const startInhaleHold = (duration = inhaleHoldTime) => {
    setBreathingState(BreathingState.InhaleHold);
    startBreathCounter(duration)
  }

  const startExhaleHold = (duration = exhaleHoldTime) => {
    setBreathingState(BreathingState.ExhaleHold);
    startBreathCounter(duration)
  }

  const startInhale = (duration = inhaleTime) => {
    hasSwell && startSwellInhale(inhaleTime);
    vibrationType && startVibration(inhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Inhale);
    setProgress({ type: AnimationType.ExpandCircle, duration })
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

  const stop = () => {
    fadeOutAnimation.setValue(1);
    stopTimer();
    stopVibration();
    stopBreathCounter();
    hasSwell && stopSwellSound();
    hasBackgroundMusic && stopBackgroundMusic();
  }

  const handlePause = () => {
    setExerciseState(ExerciseState.Paused);
    stop();
  }

  const handleTap = () => {
    const canShowOptions = exerciseState === ExerciseState.Play || exerciseState === ExerciseState.Finish;
    if (canShowOptions) {
      showOptions();
    }
  }

  const handlePressSettings = () => {
    setSettingsVisible(true);
    stopTimer();
  }

  const closeSetting = () => {
    setSettingsVisible(false);
    if (!exerciseNotStarted) {
      startExercise();
    }
  }

  const closeInfoModal = () => setInfoModalVisible(false);
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

  const handleBack = () => {
    !isPaused && stop();
    navigation.goBack()
  }

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>

      {showBackgroundCircle && <BackgroundCircle opacity={fadeOutAnimation} />}

      {exerciseNotStarted && !settingsVisible && <DurationPicker exerciseDuration={exerciseDuration} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />}

      {(isStopped || optionsVisible) && (!settingsVisible) &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />
        </>
      }
      {(isStopped || optionsVisible) && <ExerciseTitle title={name} opacity={fadeOutAnimation} />}
      <BreathingProgress rhythm={selectedRhythm} primaryColor={primaryColor} progress={progress} exerciseState={exerciseState} exhaleEnd={exhaleEnd} />

      {(!isPaused && !optionsVisible) &&
        <>
          <BreathingInstruction
            breathCounter={breathCounter} breathingState={breathingState} exerciseNotStarted={exerciseNotStarted}
            inhaleHoldTime={inhaleHoldTime} exhaleHoldTime={exhaleHoldTime}
          />
          <BreathCounter breathCounter={breathCounter} breathingState={breathingState} inhaleTime={inhaleTime} exhaleTime={exhaleTime} inhaleHoldTime={inhaleHoldTime} exhaleHoldTime={exhaleHoldTime} />
        </>
      }
      {exerciseFinished && !settingsVisible && <FinishButton color={primaryColor} handleFinish={handleFinish} />}

      <TapHandler handleTap={handleTap} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {showPause && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}
      {!settingsVisible && <ProgressBar duration={exerciseDuration} time={time} color={primaryColor} showProgressBar={showProgressBar} />}

      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}
      >
        <Settings
          vibrationType={vibrationType}
          selectedRhythm={selectedRhythm}
          backgroundMusic={backgroundMusic}
          exerciseName={name}
          closeModal={closeSetting}
        />
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
    </ImageBackground>

  );
}

export default FixedExercise;