import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, Modal } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
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
import ExerciseTitle from "../../components/ExerciseTitle";
import SettingsButton from "../../components/SettingsButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import BreathCounter from "../../components/BreathCounter";
import PauseExercise from "../../components/PauseExercise";
import BreathingInstruction from "../../components/BreathingInstructionText";

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

let totalBreathCount = 0;



const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const selectSettings = (state: RootState) => state.settings;
  const allBackgroundMusic = useSelector(selectBackgroundMusic);
  const settings = useSelector(selectSettings)
  const { backgroundMusic, vibrationType } = settings;

  const [exerciseDuration, setExerciseDuration] = useState<number>(5);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

  const renderCount = useRef(0);

  const fadeOutAnimation = useRef(new Animated.Value(1)).current;


  const { primaryColor, inhaleTime, displayName, inhaleHoldTime, exhaleTime, backgroundImagePath, backgroundGradient, exhaleHoldTime } = route.params.exercise;


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
    return () => {
      totalBreathCount = 0;
    }
  }, [])

  const timerEnd = () => {
    stopTimer();
    setExerciseState(ExerciseState.Finish);
  }

  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(breathCountEnd)
  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)
  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isPlaying = exerciseState === ExerciseState.Play;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;
  const exerciseFinished = exerciseState === ExerciseState.Finish;
  const showTimer = isPaused || exerciseFinished;

  const hasSwell = backgroundMusic === 'swell';
  const hasBackgroundMusic = backgroundMusic !== 'swell' && backgroundMusic !== null;

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const exhaleEnd = () => {
    totalBreathCount = totalBreathCount + 1;
  }

  const startExhale = (duration = exhaleTime) => {
    console.log('has swell', backgroundMusic)
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
    hasBackgroundMusic && startBackgroundMusic();
    onStartAnimation();
  }

  const handlePause = () => {
    setExerciseState(ExerciseState.Paused)
    stopTimer();
    stopBreathCounter();
    hasSwell && stopSwellSound();
    hasBackgroundMusic && stopBackgroundMusic();
    fadeOutAnimation.setValue(1)
  }

  const handlePressSettings = () => setSettingsVisible(true);
  const closeSetting = () => setSettingsVisible(false);

  const handleFinish = () => {
    console.log('handle finish');
    navigation.goBack()
  }

  const handleBack = () => navigation.goBack()


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
      {exerciseNotStarted && <DurationPicker exerciseDuration={exerciseDuration} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />}

      {isStopped &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={() => { }} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <ExerciseTitle title={displayName} opacity={fadeOutAnimation} />
          <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />
        </>
      }

      <BreathingProgress primaryColor={primaryColor} progress={progress} exerciseState={exerciseState} exhaleEnd={exhaleEnd} />

      {!isPaused &&
        <>
          <BreathingInstruction
            breathCounter={breathCounter} totalBreathCount={totalBreathCount} breathingState={breathingState} exerciseNotStarted={exerciseNotStarted}
            inhaleHoldTime={inhaleHoldTime} exhaleHoldTime={exhaleHoldTime}
          />
          <BreathCounter breathCounter={breathCounter} breathingState={breathingState} inhaleTime={inhaleTime} exhaleTime={exhaleTime} inhaleHoldTime={inhaleHoldTime} exhaleHoldTime={exhaleHoldTime} />
        </>
      }

      <PauseExercise handlePause={handlePause} disabled={exerciseFinished} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {exerciseFinished && <FinishButton handleFinish={handleFinish} />}
      <ProgressBar duration={exerciseDuration} time={time} color={primaryColor} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}
        style={{ zIndex: 100 }}
      >
        <Settings closeModal={closeSetting} color={primaryColor} />
      </Modal>

    </LinearGradient>

  );
}

export default FixedExercise;