import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, View, AppState, Modal, Text, Platform, NativeModules, ImageBackground } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import styles from "./Exercise.styles";
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
import TapHandler from "../../components/TapHandler";
import BreathingInstruction from "../../components/BreathingInstructionText";
import { ExercisesRhythm, LottieFiles } from "../../helpers/constants";
import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import BreathingInstructionText from '../../components/BreathingInstructionText';


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
  const circleProgress = useRef(new Animated.Value(0)).current;
  const totalBreathCount = useRef(0);
  const appState = useRef(AppState.currentState);

  const [exerciseDuration, setExerciseDuration] = useState<number>(1);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [iosHapticStatus, setIOSHapticStatus] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  const fadeOutAnimation = useRef(new Animated.Value(1)).current;




  const { name, info, summary, primaryColor, displayName, defaultMusic, backgroundImage } = route.params.exercise;

  const backgroundMusic = _.get(settingsInfo, `${name}.backgroundMusic`, defaultMusic);
  const selectedRhythm = _.get(settingsInfo, `${name}.rhythm`, 'standard');
  const vibrationType = _.get(settingsInfo, `${name}.vibrationType`, true);
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
    if (settingsVisible) {
      stopBackgroundMusic();
      startBackgroundMusic();
    }
  }, [backgroundMusic])

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    } else {
      handlePause();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      NativeModules.IOSVibration.getHapticStatus((error: any, resp: boolean) => {
        setIOSHapticStatus(resp)
        if (resp) NativeModules.IOSVibration.prepareHaptics();
      });
    }
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, [])

  const timerEnd = () => {
    setExerciseState(ExerciseState.Finish);
  }

  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(holdTimeEnd)
  const { time, startTimer, stopTimer } = useTimer(timerEnd, exerciseDuration)
  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;

  const exerciseFinished = exerciseState === ExerciseState.Finish;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;
  const hasSwell = backgroundMusic === 'swells';
  const hasBackgroundMusic = backgroundMusic !== 'swells' && backgroundMusic !== null;
  const canPlaySwell = hasSwell && !settingsVisible;
  const showBackgroundCircle = (isStopped || isPaused);

  const handleTimeSelect = (time: number) => {
    setExerciseDuration(time);
  }

  const exhaleEnd = () => {
    exhaleHoldTime ? startExhaleHold() : startInhale();
  }

  const startExhale = (duration = exhaleTime) => {
    totalBreathCount.current = totalBreathCount.current + 1;
    canPlaySwell && startSwellExhale(exhaleTime);
    Animated.timing(circleProgress, {
      toValue: 1,
      delay: inhaleHoldTime ? 0 : 400,
      duration: duration * 1000,
      useNativeDriver: true,
      // easing: Easing.bezier(0.47, 0.0, 0.745, 0.715),
      easing: Easing.linear,
    }).start(({ finished }) => {
      finished && exhaleEnd()
    });

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


  const inhaleEnd = () => {
    inhaleHoldTime ? startInhaleHold() : startExhale();
  }

  const startInhale = (duration = inhaleTime) => {
    canPlaySwell && startSwellInhale(inhaleTime);
    vibrationType && startVibration(inhaleTime);
    circleProgress.setValue(0);
    setBreathingState(BreathingState.Inhale);
    Animated.timing(circleProgress, {
      toValue: 0.5,
      delay: exhaleHoldTime ? 0 : 400,
      duration: duration * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({ finished }) => {
      finished && inhaleEnd();
    });
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
    if (!exerciseNotStarted) {
      setExerciseState(ExerciseState.Paused);
      totalBreathCount.current = 0;
    }
    stop();
  }

  const handleTap = () => {
    const canShowOptions = exerciseState === ExerciseState.Play || exerciseState === ExerciseState.Finish;
    if (canShowOptions) {
      showOptions();
    }
  }

  const handlePressSettings = () => {
    handlePause();
    setSettingsVisible(true);

  }

  const closeSetting = () => {
    setSettingsVisible(false);
  }

  const closeInfoModal = () => setInfoModalVisible(false);
  const handlePressInfo = () => {
    if (!isPaused) {
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
  const instructionText = getBreathingStateText();
  const anaimationFile = LottieFiles[name];
  const showModal = settingsVisible || infoModalVisible;

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>
      { !showModal ? <>
        {showBackgroundCircle && <BackgroundCircle opacity={fadeOutAnimation} />}

        {exerciseNotStarted && !settingsVisible &&
          <>
            <View style={styles.summaryContainer}>
              <Text style={styles.summary}>{summary}</Text>
            </View>
            <DurationPicker exerciseDuration={exerciseDuration} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />
          </>
        }


        {(isStopped || optionsVisible) && (!settingsVisible) &&
          <>
            <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />
            <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
            <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />
          </>
        }
        {(isStopped || optionsVisible) && <ExerciseTitle title={name} opacity={fadeOutAnimation} />}
        {!isPaused &&
          <View style={{ position: 'absolute', top: 0, left: 40, right: 40, bottom: 0, }}>
            <LottieView source={anaimationFile} progress={circleProgress} />
          </View>
        }



        {(!isPaused && !optionsVisible) &&
          <BreathingInstructionText totalBreathCount={totalBreathCount.current} instructionText={instructionText} count={breathCounter} />
        }
        {exerciseFinished && !settingsVisible && <FinishButton color={primaryColor} handleFinish={handleFinish} />}

        <TapHandler handleTap={handleTap} />
        {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
        {showPause && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}
        {!settingsVisible && <ProgressBar duration={exerciseDuration} time={time} color={primaryColor} showProgressBar={showProgressBar} />}

      </>
        :
        <>
          <Modal
            animationType="fade"
            transparent={true}
            visible={infoModalVisible}
            onRequestClose={closeInfoModal}
          >
            <InfoModal
              title={name}
              info={info}
              handleClose={closeInfoModal}
            />
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={settingsVisible}
            onRequestClose={closeSetting}
          >
            <Settings
              iosHapticStatus={iosHapticStatus}
              selectedRhythm={selectedRhythm}
              backgroundMusic={backgroundMusic}
              name={name}
              info={info}
              appStateVisible={appStateVisible}
              backgroundImage={backgroundImage}
              primaryColor={primaryColor}
              vibrationType={vibrationType}
              closeModal={closeSetting}
            />
          </Modal>

        </>

      }

    </ImageBackground>

  );
}

export default FixedExercise;