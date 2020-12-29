import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { Exercise } from "../../redux/actions/exercise";
import { RouteProp } from '@react-navigation/native';
import styles from "./FixedExercise";
import LottieView from 'lottie-react-native';
import useBreathTimer from "../../hooks/useBreathTimer";
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

  const breathTimeEnd = () => {
    console.log('yo', breathingState)
    if (breathingState === BreathingState.Inhale) {
      startInhaleHold();
      return;
    }
    if (breathingState === BreathingState.Exhale) {
      startExhaleHold();
      return;
    }
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  const holdTimeEnd = () => {
    if (breathingState === BreathingState.InhaleHold) {
      startExhale()
      return
    }
    if (breathingState === BreathingState.ExhaleHold) {
      startInhale();
      return
    }
  }

  const timerEnd = () => {
    stopTimer();
    setButtonState(ControllerButton.Finish);
  }

  const { breathTimer, startBreathTimer, stopBreathTimer } = useBreathTimer(() => { })
  const { holdTimer, startHoldTimer, stopHoldTimer } = useHoldTimer(holdTimeEnd);
  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)
  const { animationFile: progressAnimation } = useAnimationReader(lottieFilePath)

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const startExhale = (duratoin = exhaleTime) => {
    startBreathTimer(duratoin)
    setBreathingState(BreathingState.Exhale)
    Animated.timing(animatedProgress, {
      toValue: 1,
      duration: duratoin * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setBreathingState(BreathingState.ExhaleHold);
      startExhaleHold();
    });

  }



  const startInhaleHold = (duration = inhaleHoldTime) => {
    setBreathingState(BreathingState.InhaleHold);
    startHoldTimer(duration)
  }


  const startExhaleHold = (duration = exhaleHoldTime) => {
    console.log('start Exahle Hold')
    setBreathingState(BreathingState.ExhaleHold);
    startHoldTimer(duration)
  }

  const startInhale = (duration = inhaleTime) => {
    startBreathTimer(duration)
    setBreathingState(BreathingState.Inhale);
    Animated.timing(animatedProgress, {
      toValue: 0.5,
      duration: duration * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setBreathingState(BreathingState.InhaleHold)
      startInhaleHold();
    });
  }

  console.log('render count', renderCount);

  const pauseTimer = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        stopBreathTimer()
        return
      case (BreathingState.Exhale):
        stopBreathTimer()
        return
      case (BreathingState.ExhaleHold):
        stopHoldTimer();
        return
      case (BreathingState.InhaleHold):
        stopHoldTimer();
        return
    }
  }

  const continueTimer = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        startBreathTimer();
        return
      case (BreathingState.Exhale):
        startBreathTimer();
        return
      case (BreathingState.ExhaleHold):
        startHoldTimer();
        return
      case (BreathingState.InhaleHold):
        startHoldTimer();
        return
    }
  }



  const handleStart = () => {
    startInhale();
    setButtonState(ControllerButton.Start)
    startTimer();
  }

  const handlePause = () => {
    setButtonState(ControllerButton.Continue)
    stopTimer();
    pauseTimer();
    Animated.timing(animatedProgress).stop();
  }

  const handleContinue = () => {
    setButtonState(ControllerButton.Pause)
    startTimer();
    continueTimer()
  }

  const handleFinish = () => {
    console.log('finish');
  }

  console.log('breathing state', breathingState);
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
        <Text style={styles.buttonText}>{time}</Text>
      </View>
      <BreathingInstruction breathingState={breathingState} />
      {showPlayButton &&
        <View style={styles.absoluteContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handleStart}>
            <Text style={styles.start}>START</Text>
          </TouchableOpacity>
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