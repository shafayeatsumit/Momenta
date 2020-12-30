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
  const breathCounterAnim = useRef(new Animated.Value(1)).current
  const { inhaleTime, inhaleHoldTime, exhaleTime, exhaleHoldTime, lottieFilePath } = route.params.exercise;

  const showTimePicker = breathingState === BreathingState.NotStarted
  const showPlayButton = breathingState === BreathingState.NotStarted;

  const breathTimeEnd = () => {
    breathCounterAnim.setValue(0);
    breathCounterAnimation();
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

  const { breathTimer, startBreathTimer, stopBreathTimer } = useBreathTimer(breathTimeEnd)
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
    }).start();
  }



  const startInhaleHold = (duration = inhaleHoldTime) => {
    setBreathingState(BreathingState.InhaleHold);
    startBreathTimer(duration)
  }

  const startExhaleHold = (duration = exhaleHoldTime) => {
    setBreathingState(BreathingState.ExhaleHold);
    startBreathTimer(duration)
  }

  const startInhale = (duration = inhaleTime) => {
    startBreathTimer(duration)
    setBreathingState(BreathingState.Inhale);
    Animated.timing(animatedProgress, {
      toValue: 0.5,
      duration: duration * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  console.log('render count', renderCount);

  const pauseTimer = () => {
    stopBreathTimer()
  }

  const continueBreathTimer = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        startInhale(breathTimer);
        return
      case (BreathingState.Exhale):
        startExhale(breathTimer);
        return
      case (BreathingState.ExhaleHold):
        startBreathTimer(breathTimer)
        return
      case (BreathingState.InhaleHold):
        startBreathTimer(breathTimer)
        return
      default:
        return;
    }
  }

  const breathCounterAnimation = () => {
    Animated.timing(breathCounterAnim, {
      toValue: 1,
      duration: 1,
      delay: 450,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
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
    continueBreathTimer()
  }

  const handleFinish = () => {
    console.log('finish');
  }

  console.log('breath counter anim', breathCounterAnim);
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

      <Animated.View style={{ opacity: breathCounterAnim, marginTop: 360, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.start}>{breathTimer}</Text>
      </Animated.View>


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