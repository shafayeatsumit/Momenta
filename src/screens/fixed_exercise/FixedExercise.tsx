import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { Exercise } from "../../redux/actions/exercise";
import { RouteProp } from '@react-navigation/native';
import styles from "./FixedExercise";
import LottieView from 'lottie-react-native';
import useBreathCounter from "../../hooks/useBreathCounter";
import ScrollPicker from "../../components/ScrollPicker";
import useHoldTimer from '../../hooks/useHoldTimer';
import useAnimationReader from '../../hooks/useAnimationReader';
import useTimer from "../../hooks/useTimer";
import { BreathingState, ControllerButton } from "../../helpers/types";
import ExerciseController from "../../components/ExerciseController";
import BreathingInstruction from "../../components/BreathingInstructionText";

interface Props {
  route: RouteProp<any, any>;
}

const FixedExercise: React.FC<Props> = ({ route }: Props) => {
  const [exerciseDuration, setExerciseDuration] = useState<number>(5);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [buttonState, setButtonState] = useState<ControllerButton | null>(null);

  const renderCount = useRef(0);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const { inhaleTime, inhaleHoldTime, exhaleTime, exhaleHoldTime, lottieFilePath } = route.params.exercise;

  const showTimePicker = breathingState === BreathingState.NotStarted
  const showPlayButton = breathingState === BreathingState.NotStarted;

  const breathCountEnd = () => {

    switch (breathingState !== 0) {
      case (breathingState === BreathingState.Inhale):
        startInhaleHold();
        return
      case (breathingState === BreathingState.Exhale):
        startExhaleHold();
        return
      case (breathingState === BreathingState.InhaleHold):
        startExhale();
        return
      case (breathingState === BreathingState.ExhaleHold):
        startInhale();
        return
    }
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
  const { animationFile: progressAnimation } = useAnimationReader(lottieFilePath)

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

  // console.log('render count', renderCount);
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

  const isShowBreathCounterVisible = () => {
    if (BreathingState.Inhale && breathCounter === inhaleTime) {
      return false
    }
    if (BreathingState.Exhale && breathCounter === exhaleTime) {
      return false
    }
    if (BreathingState.InhaleHold && breathCounter === inhaleHoldTime) {
      return false
    }
    if (BreathingState.ExhaleHold && breathCounter === exhaleHoldTime) {
      return false;
    }
    return true;
  }


  const handleStart = () => {
    startInhale();
    setButtonState(ControllerButton.Start)
    startTimer();
  }

  const handlePause = () => {
    setButtonState(ControllerButton.Continue)
    stopTimer();
    stopBreathCounter();
    Animated.timing(animatedProgress).stop();
  }

  const handleContinue = () => {
    setButtonState(ControllerButton.Pause)
    startTimer();
    continueBreathCounter()
  }

  const handleFinish = () => {
    console.log('finish');
  }

  const breathCounterVisible = isShowBreathCounterVisible();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.absoluteContainer}>
        {progressAnimation &&
          <LottieView
            source={progressAnimation}
            style={styles.lottieFile}
            progress={animatedProgress}
          />
        }
      </View>
      <View style={styles.timer}>
        <Text style={styles.buttonText}>time: {time}</Text>
      </View>

      <BreathingInstruction breathingState={breathingState} />
      {showPlayButton &&
        <View style={styles.absoluteContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handleStart}>
            <Text style={styles.start}>START</Text>
          </TouchableOpacity>
        </View>
      }

      {breathCounterVisible &&
        <View style={{ marginTop: 360, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.start}>{breathCounter}</Text>
        </View>
      }



      {showTimePicker && <ScrollPicker onSelect={handleTimeSelect} initialValue={exerciseDuration} />}
      <ExerciseController
        buttonState={buttonState}
        handleContinue={handleContinue}
        handleFinish={handleFinish}
        handlePause={handlePause}
      />
    </View>
  );
}

export default FixedExercise;