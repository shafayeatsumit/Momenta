import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";

import BreathingProgress from "../../components/BreathingProgress";
import BackgroundImage from "../../components/BackgroundImage";
import BackgroundCircle from "../../components/BackgroundCircle"
import InnerCircle from "../../components/InnerCircle";
import Timer from "../../components/Timer";
import DurationPicker from "../../components/DurationPicker";
import useAnimationReader from '../../hooks/useAnimationReader';
import PlayButton from "../../components/PlayButton";
import ExerciseTitle from "../../components/ExerciseTitle";
import Settings from "../../components/Settings";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import BreathCounter from "../../components/BreathCounter";
import ExerciseController from "../../components/ExerciseController";
import BreathingInstruction from "../../components/BreathingInstructionText";

import { BreathingState, ControllerButton } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}


const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const [exerciseDuration, setExerciseDuration] = useState<number>(5);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [buttonState, setButtonState] = useState<ControllerButton | null>(null);

  const renderCount = useRef(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;
  const fadeInAnimation = useRef(new Animated.Value(0)).current;

  const { inhaleTime, progressAnimationBackground, displayName, inhaleHoldTime, exhaleTime, backgroundImagePath, backgroundGradient, exhaleHoldTime, progressAnimationPath } = route.params.exercise;


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
    }).start();
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 800,
      delay: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(startExercise);
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  const timerEnd = () => {
    stopTimer();
    setButtonState(ControllerButton.Finish);
  }

  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(breathCountEnd)
  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)
  const { animationFile: progressAnimation } = useAnimationReader(progressAnimationPath)

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const startExhale = (duratoin = exhaleTime) => {
    startBreathCounter(duratoin)
    setBreathingState(BreathingState.Exhale)
    Animated.timing(animatedProgress, {
      toValue: 1,
      duration: duratoin * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
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
    startBreathCounter(duration)
    setBreathingState(BreathingState.Inhale);
    Animated.timing(animatedProgress, {
      toValue: 0.5,
      duration: duration * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  const continueBreathCounter = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        startInhale(breathCounter);
        return
      case (BreathingState.Exhale):
        startExhale(breathCounter);
        return
      case (BreathingState.ExhaleHold):
        startBreathCounter(breathCounter)
        return
      case (BreathingState.InhaleHold):
        startBreathCounter(breathCounter)
        return
      default:
        return;
    }
  }



  const startExercise = () => {
    startInhale();
    setButtonState(ControllerButton.Start)
    startTimer();
  }

  const handleStart = () => {
    onStartAnimation();
  }

  const handlePause = () => {
    setButtonState(ControllerButton.Continue)
    stopTimer();
    stopBreathCounter();
    fadeOutAnimation.setValue(1)
    Animated.timing(animatedProgress).stop();
  }

  const handleContinue = () => {
    setButtonState(ControllerButton.Pause)
    startTimer();
    continueBreathCounter()
    fadeOutAnimation.setValue(0)
  }

  const handleFinish = () => {
    console.log('finish');
  }

  const handleBack = () => navigation.goBack()

  const exerciseNotStarted = breathingState === BreathingState.NotStarted;
  const isPaused = buttonState === ControllerButton.Continue;
  const showIcons = isPaused || exerciseNotStarted;
  const showProgressAnimation = !exerciseNotStarted && progressAnimation

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
      <InnerCircle circleOpacity={fadeInAnimation} circleBackgroundColor={progressAnimationBackground} />
      <BackgroundCircle />

      {isPaused && <Timer time={time} exerciseDuration={exerciseDuration} />}
      {exerciseNotStarted && <DurationPicker exerciseDuration={exerciseDuration} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />}

      {showIcons &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={() => { }} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <ExerciseTitle title={displayName} opacity={fadeOutAnimation} />
          <Settings opacity={fadeOutAnimation} />
        </>
      }
      {showProgressAnimation &&
        <BreathingProgress animationFile={progressAnimation} animatedProgress={animatedProgress} />
      }
      <BreathingInstruction breathingState={breathingState} exerciseNotStarted={exerciseNotStarted} />
      <BreathCounter breathCounter={breathCounter} breathingState={breathingState} inhaleTime={inhaleTime} exhaleTime={exhaleTime} inhaleHoldTime={inhaleHoldTime} exhaleHoldTime={exhaleHoldTime} />
      {exerciseNotStarted && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      <ExerciseController
        buttonState={buttonState}
        handleContinue={handleContinue}
        handleFinish={handleFinish}
        handlePause={handlePause}
      />
    </LinearGradient>

  );
}

export default FixedExercise;