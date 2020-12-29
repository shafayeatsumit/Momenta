import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { Exercise } from "../../redux/actions/exercise";
import { RouteProp } from '@react-navigation/native';
import styles from "./FixedExercise";
import LottieView from 'lottie-react-native';
import useInterval from '../../helpers/hooks/useInterval';
import ScrollPicker from "../../components/ScrollPicker";

var RNFS = require('react-native-fs');

interface Props {
  route: RouteProp<any, any>;
}

enum BreathingState {
  Inhale,
  InhaleHold,
  Exhale,
  ExhaleHold,
  NotStarted,
}


const FixedExercise: React.FC<Props> = ({ route }: Props) => {
  const [breathAnimation, setBreathAnimation] = useState(null);
  const [showTimePicker, setTimePicker] = useState<boolean>(true);
  const [exerciseDuration, setExerciseDuration] = useState<number>(5);
  const [showStart, setStart] = useState<boolean>(true);
  const [showPause, setPause] = useState<boolean>(false);
  const [showContinue, setContinue] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [breathTimer, setBreathTimer] = useState<number>(0);
  const [breathTimerIsRunning, setBreathTimerIsRunning] = useState<boolean>(0);
  const [holdTimer, setHoldTimer] = useState<number>(0);
  const [holdTimerIsRunning, setHoldTimerIsRunning] = useState<boolean>(false);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)

  const animatedProgress = useRef(new Animated.Value(0)).current;
  const { inhaleTime, inhaleHoldTime, exhaleTime, exhaleHoldTime, lottieFilePath } = route.params.exercise;

  const handleTimer = () => {
    setTimerIsRunning((running) => !running);
  }

  useInterval(() => {
    setTime(time + 1);
  }, timerIsRunning ? 1000 : null);

  useEffect(() => {
    RNFS.readFile(lottieFilePath, 'utf8')
      .then((res: any) => {
        setBreathAnimation(JSON.parse(res))
      })
      .catch((error: any) => console.log('error', error))
  }, [])

  const handleTimeSelect = (time: number) => {
    console.log("time picked", time)
  }

  const startExhale = (duratoin = exhaleTime) => {
    setBreathTimer(duratoin);
    setBreathingState(BreathingState.Exhale)
    setBreathTimerIsRunning(true);
    Animated.timing(animatedProgress, {
      toValue: 1,
      duration: duratoin * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

  }

  useInterval(() => {
    if (holdTimer === 0) {
      setHoldTimerIsRunning(false);
      if (breathingState === BreathingState.InhaleHold) {
        startExhale()
        return
      }
      if (breathingState === BreathingState.ExhaleHold) {
        startInhale();
        return
      }
      return
    }
    setHoldTimer(holdTimer - 1)
  }, holdTimerIsRunning ? 1000 : null)

  useInterval(() => {
    if (breathTimer === 0) {
      setBreathTimerIsRunning(false);
      if (breathingState === BreathingState.Inhale) {
        startInhaleHold();
        return;
      }
      if (breathingState === BreathingState.Exhale) {
        startExhaleHold();
        return;
      }
      return;
    }
    setBreathTimer(breathTimer - 1)
  }, breathTimerIsRunning ? 1000 : null)

  const startInhaleHold = (duration = inhaleHoldTime) => {
    console.log('duration +++>', duration);
    setBreathingState(BreathingState.InhaleHold);
    setHoldTimer(duration)
    setHoldTimerIsRunning(true);
  }

  const startExhaleHold = (duration = exhaleHoldTime) => {
    console.log('duration +++___>', duration);
    setBreathingState(BreathingState.ExhaleHold);
    setHoldTimer(duration);
    setHoldTimerIsRunning(true);
  }

  const startInhale = (duration = inhaleTime) => {
    setBreathTimer(duration);
    setBreathingState(BreathingState.Inhale);
    setBreathTimerIsRunning(true)
    Animated.timing(animatedProgress, {
      toValue: 0.5,
      duration: duration * 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

  }

  const handleStart = () => {
    startInhale();
    setTimePicker(false);
    setStart(false);
    setPause(true);
    setTimerIsRunning(true);
  }

  const pauseTimer = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        setBreathTimerIsRunning(false)
        return
      case (BreathingState.Exhale):
        setBreathTimerIsRunning(false)
        return
      case (BreathingState.ExhaleHold):
        setHoldTimerIsRunning(false);
        return
      case (BreathingState.InhaleHold):
        setHoldTimerIsRunning(false);
        return
    }
  }

  const continueTimer = () => {
    switch (breathingState) {
      case (BreathingState.Inhale):
        setBreathTimerIsRunning(true)
        return
      case (BreathingState.Exhale):
        setBreathTimerIsRunning(true)
        return
      case (BreathingState.ExhaleHold):
        setHoldTimerIsRunning(true);
        return
      case (BreathingState.InhaleHold):
        setHoldTimerIsRunning(true);
        return
    }
  }

  const handlePause = () => {
    setContinue(true)
    setPause(false)
    handleTimer();
    pauseTimer();
    Animated.timing(animatedProgress).stop();
  }

  const getBreathingStateText = () => {
    console.log('breathing ', breathingState);
    switch (breathingState !== null) {

      case (breathingState === BreathingState.Inhale):
        return "Inhale"
      case (breathingState === BreathingState.Exhale):
        return "Exhale"
      case (breathingState === BreathingState.InhaleHold):
        return "Hold"
      case (breathingState === BreathingState.ExhaleHold):
        return "Hold"
      default:
        return ""
    }
  }

  const handleContinue = () => {
    setContinue(false)
    setPause(true)
    handleTimer();
    continueTimer()
  }
  console.log('breathing state', breathingState);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.absoluteContainer}>
        {breathAnimation &&
          <LottieView
            source={breathAnimation}
            style={styles.lottieFile}
            progress={animatedProgress}
          />
        }
      </View>
      <View style={styles.timer}>
        <Text style={styles.buttonText}>{time}</Text>
      </View>
      <View style={styles.absoluteContainer}>
        <Text style={styles.start}>
          {getBreathingStateText()}
        </Text>
      </View>
      {showStart &&
        <View style={styles.absoluteContainer}>
          <TouchableOpacity style={styles.playButton} onPress={handleStart}>
            <Text style={styles.start}>START</Text>
          </TouchableOpacity>
        </View>
      }
      {showTimePicker && <ScrollPicker onSelect={handleTimeSelect} initialValue={exerciseDuration} />}
      {showPause &&
        <TouchableOpacity style={styles.button} onPress={handlePause}>
          <Text style={styles.buttonText}>pause</Text>
        </TouchableOpacity>
      }

      {showContinue &&
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

export default FixedExercise;