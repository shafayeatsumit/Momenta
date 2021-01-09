import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";

import BreathingProgress from "../../components/BreathingProgress";
import FinishButton from "../../components/FinishButton";
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
import PauseExercise from "../../components/PauseExercise";
import BreathingInstruction from "../../components/BreathingInstructionText";

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
let breathCount = 0;


const GuidedExercise: React.FC<Props> = ({ navigation, route }: Props) => {
  const {
    calibrationInhale, calibrationExhale, targetInhale, targetExhale, targetDuration, primaryColor,
    displayName, backgroundImagePath, backgroundGradient, progressAnimationPath
  } = route.params.exercise;



  const avgExhale = avgTime(calibrationExhale, targetExhale);
  const avgInhale = avgTime(calibrationInhale, targetInhale);
  const targetBreathCount = Math.ceil(targetDuration * 60 / (avgInhale + avgExhale));
  const exhlaeIncrement = (targetExhale - calibrationExhale) / targetBreathCount;
  const inhaleIncrement = (targetInhale - calibrationInhale) / targetBreathCount;
  if (!inhaleTime) {
    inhaleTime = calibrationInhale + inhaleIncrement;
  }

  if (!exhaleTime) {
    exhaleTime = calibrationExhale + exhlaeIncrement;
  }




  const [exerciseDuration, setExerciseDuration] = useState<number>(5);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });

  const renderCount = useRef(0);
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;

  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isPlaying = exerciseState === ExerciseState.Play;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;
  const exerciseFinished = exerciseState === ExerciseState.Finish;
  const showTimer = isPaused || exerciseFinished;
  const showInstruction = breathCount < 5 && (isPlaying || exerciseFinished)


  const onStartAnimation = () => {
    Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(startExercise);
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  useEffect(() => {
    return () => {
      inhaleTime = 0;
      exhaleTime = 0;
      breathCount = 0;
    };
  }, [])

  const timerEnd = () => {
    stopTimer();
    setExerciseState(ExerciseState.Finish);
  }

  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const startExhale = (duration = exhaleTime) => {
    setBreathingState(BreathingState.Exhale)
    setBreathingState(BreathingState.Exhale)
    setProgress({ type: AnimationType.ShrinkCircle, duration })
  }

  const exhaleEnd = () => {
    console.log('exhlae end');
    breathCount = breathCount + 1;
    const noIncrement = breathCount >= targetBreathCount;
    if (noIncrement) {
      startInhale();
    } else {
      exhaleTime = exhaleTime + exhlaeIncrement;
      inhaleTime = inhaleTime + inhaleIncrement;
      startInhale();
    }
  }

  const inhaleEnd = () => {
    startExhale();
  }

  const startInhale = (duration = inhaleTime) => {
    setBreathingState(BreathingState.Inhale);
    setProgress({ type: AnimationType.ExpandCircle, duration })
  }

  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)
    startTimer();
  }

  const handleStart = () => {
    onStartAnimation();
  }

  const handlePause = () => {
    setExerciseState(ExerciseState.Paused)
    stopTimer();
    fadeOutAnimation.setValue(1)
  }



  const handleFinish = () => {
    navigation.goBack()
  }

  const handleBack = () => navigation.goBack()

  console.log('inhale time', inhaleTime);
  console.log('exhale time', exhaleTime);
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
          <Settings opacity={fadeOutAnimation} />
        </>
      }
      <BreathingProgress primaryColor={primaryColor} progress={progress} exerciseState={exerciseState} exhaleEnd={exhaleEnd} inhaleEnd={inhaleEnd} />
      {showInstruction && <BreathingInstruction breathingState={breathingState} exerciseNotStarted={exerciseNotStarted} />}
      <PauseExercise handlePause={handlePause} disabled={exerciseFinished} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {exerciseFinished && <FinishButton handleFinish={handleFinish} />}

    </LinearGradient>
  );
}

export default GuidedExercise;