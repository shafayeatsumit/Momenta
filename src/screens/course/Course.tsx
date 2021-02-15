import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import Settings from '../settings/Settings';
import { startSwellExhale, startSwellInhale, stopSwellSound } from "../../helpers/SoundPlayer";
import { playBackgroundMusic, fadeInBackground, stopBackgroundMusic } from "../../helpers/LessonPlayer";
import ProgressBar from '../../components/ProgressBar';
import BreathingProgress from "../../components/BreathingProgress";
import BackgroundImage from "../../components/BackgroundImage";
import LessonBackButton from "../../components/LessonBack";
import BackgroundCircle from "../../components/BackgroundCircle"
import FinishButton from "../../components/FinishButton";
import NavigateLesson from "../../components/NavigateLesson";
import Timer from "../../components/Timer";
import DurationPicker from "../../components/DurationPicker";
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import LessonTitle from "../../components/LessonTitle";
import SettingsButton from "../../components/SettingsButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import TapHandler from "../../components/TapHandler";
import { updateUserStats } from "../../redux/actions/userStats";
import BreathingInstruction from "../../components/BreathingInstructionText";
import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import CourseTitle from '../../components/CourseTitle';
import Sound from 'react-native-sound'

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
let navigationListenerId: null | ReturnType<typeof setTimeout> = null;
let lessonStarted = false;
let activeLessonEnd = false;



const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const selectSettings = (state: RootState) => state.settings;
  const selectUserStats = (state: RootState) => state.userStats;
  const userStats = useSelector(selectUserStats);
  const allBackgroundMusic = useSelector(selectBackgroundMusic);
  const settings = useSelector(selectSettings)

  const { backgroundMusic, vibrationType } = settings;
  const { id: courseId, inhaleTime, primaryColor, lessons, thumbnail, totalLessons, name, exhaleTime, backgroundImage, backgroundGradient, } = route.params.course;


  const [exerciseDuration, setExerciseDuration] = useState<number>(2);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [iosHapticStatus, setIOSHapticStatus] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);



  const activeLesson = lessons[activeLessonIndex];
  const renderCount = useRef(0);

  const fadeOutAnimation = useRef(new Animated.Value(1)).current;




  const goToNextLesson = async () => {
    activeLessonEnd = false;

    statsUpdate();
    const upcomingLessonIndex = activeLessonIndex + 1;
    setActiveLessonIndex(upcomingLessonIndex);
    hasSwell && stopSwellSound();
    hasBackgroundMusic && stopBackgroundMusic();
    startVoiceOver(upcomingLessonIndex);

  }




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
        startExhale();
        return
      case (breathingState === BreathingState.Exhale):
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
    const music = allBackgroundMusic.find((item) => item.id === backgroundMusic);
    if (music) {
      playBackgroundMusic(music.fileName);
    }
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  })

  const iosHapticsSetup = () => {
    NativeModules.IOSVibration.getHapticStatus((error: any, resp: boolean) => {
      setIOSHapticStatus(resp)
      if (resp) NativeModules.IOSVibration.prepareHaptics();
    });

  }

  const setUpInitLesson = () => {
    const isListenedBefore = userStats[courseId];
    if (!isListenedBefore) {
      return
    }
    const lastLesson = userStats[courseId].lastFinishedLesson;
    if (lastLesson === totalLessons) {
      return
    }
    setActiveLessonIndex(lastLesson)
  }

  const playTrack = (url: string) => {
    const track = new Sound(url, null, (e) => {
      if (e) {
        console.log('error loading track:', e)
      } else {
        track.play()
      }
    })
  }

  const setupTrackPlayer = () => {
    TrackPlayer.addEventListener('playback-queue-ended', (event) => {
      // lessonComplete();
      if (event.track) {
        lessonComplete();
      }
    })

  }

  useEffect(() => {
    setupTrackPlayer();
    if (Platform.OS === 'ios') {
      iosHapticsSetup();
    }
    setUpInitLesson();

    return () => {
      activeLessonEnd = false;
      totalBreathCount = 0;
      TrackPlayer.reset();
      if (navigationListenerId) {
        clearTimeout(navigationListenerId)
      }
      lessonStarted = false;
      stop();
    }
  }, [])



  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(breathCountEnd)
  const { time, startTimer, stopTimer } = useTimer(() => { }, exerciseDuration)
  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;


  const showTimer = isPaused || optionsVisible;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;
  const hasSwell = backgroundMusic === 'swell';
  const hasBackgroundMusic = backgroundMusic !== 'swell' && backgroundMusic !== null;
  const showBackgroundCircle = (isStopped || isPaused);


  const exhaleEnd = () => {
    totalBreathCount = totalBreathCount + 1;
  }

  const startExhale = (duration = exhaleTime) => {
    hasSwell && startSwellExhale(exhaleTime);
    vibrationType === 'purr_exhale' && startVibration(exhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Exhale)
    setProgress({ type: AnimationType.ShrinkCircle, duration })
  }


  const startInhale = (duration = inhaleTime) => {
    hasSwell && startSwellInhale(inhaleTime);
    vibrationType === 'purr_inhale' && startVibration(inhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Inhale);
    setProgress({ type: AnimationType.ExpandCircle, duration })
  }



  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)
    startTimer();
  }

  const statsUpdate = () => {
    const isLastLesson = activeLessonIndex + 1 === totalLessons;
    if (isLastLesson) {
      dispatch(updateUserStats(courseId, activeLessonIndex + 1, true))
      return;
    }
    const isLessonFinished = userStats[courseId]
      ? userStats[courseId].isFinished : false;
    dispatch(updateUserStats(courseId, activeLessonIndex + 1, isLessonFinished))

  }

  const lessonComplete = () => {
    activeLessonEnd = true;
  }



  const startVoiceOver = async (lessonIndex: number) => {
    const activeLesson = lessons[lessonIndex];
    await TrackPlayer.add(activeLesson);
    await TrackPlayer.play();
    hasBackgroundMusic && fadeInBackground();
  }

  console.log('active lesson end', activeLessonEnd);

  const handleStart = () => {
    if (!lessonStarted) {
      lessonStarted = true;
    }
    triggerHaptic();
    hasBackgroundMusic && startBackgroundMusic();

    startVoiceOver(activeLessonIndex);
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
    setExerciseState(ExerciseState.Paused);
    stop();

    TrackPlayer.pause();
  }

  const handleTap = () => {
    if (exerciseState === ExerciseState.Play) {
      showOptions();
    }
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

  const handlePressInfo = () => {
    if (exerciseNotStarted) {
      stop();
    } else if (!isPaused) {
      handlePause();
    }
    setInfoModalVisible(true);
  }

  const handleFinish = () => {
    statsUpdate();
    triggerHaptic();
    stop();
    navigation.goBack()
    TrackPlayer.stop();
  }

  const handleBack = () => {
    !isPaused && stop();
    navigation.goBack()
    TrackPlayer.stop();
  }

  const handleLessonBack = () => {
    setActiveLessonIndex(activeLessonIndex - 1)
  }

  const canGoBack = activeLessonIndex > 0;
  const courseFinished = activeLessonEnd && activeLessonIndex + 1 === 3;
  const showLessonBack = !lessonStarted && canGoBack;
  console.log('active lesson duration ===>', activeLesson.duration);
  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.05, y: 0.95 }}
      colors={backgroundGradient}
      style={{ flex: 1 }}
    >
      <BackgroundImage imagePath={backgroundImage} />
      {showBackgroundCircle && <BackgroundCircle opacity={fadeOutAnimation} />}

      {showTimer && <Timer time={time} exerciseDuration={exerciseDuration} />}

      {(isStopped || optionsVisible) &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <CourseTitle title={name} opacity={fadeOutAnimation} />
          <LessonTitle lesson={activeLesson} totalLessons={totalLessons} opacity={fadeOutAnimation} />
          {!lessonStarted && <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />}

        </>
      }

      <BreathingProgress primaryColor={primaryColor} progress={progress} exerciseState={exerciseState} exhaleEnd={exhaleEnd} />

      {!isPaused && !optionsVisible &&
        <>
          <BreathingInstruction
            breathCounter={breathCounter} totalBreathCount={totalBreathCount} breathingState={breathingState} exerciseNotStarted={exerciseNotStarted}
          />
        </>
      }

      <TapHandler handleTap={handleTap} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {showPause && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}

      {activeLessonEnd && !courseFinished && <NavigateLesson title="Next" handleNextLesson={goToNextLesson} color={primaryColor} />}
      {courseFinished && <FinishButton color={primaryColor} handleFinish={handleFinish} />}
      {showLessonBack && <LessonBackButton opacity={fadeOutAnimation} handlePress={handleLessonBack} />}
      <ProgressBar duration={60} time={time} color={primaryColor} showProgressBar={showProgressBar} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}
      >
        <Settings closeModal={closeSetting} color={primaryColor} />
      </Modal>


    </LinearGradient>

  );
}

export default FixedExercise;