import React, { useState, useEffect, useRef } from 'react'
import { Animated, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import BreathingProgress from "../../components/BreathingProgress";
import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import Settings from '../settings/Settings';
import { startSwellExhale, startSwellInhale, stopSwellSound } from "../../helpers/SoundPlayer";
import { playBackgroundMusic, fadeInBackground, stopBackgroundMusic } from "../../helpers/LessonPlayer";
import ProgressBar from '../../components/ProgressBar';
import DurationPicker from "../../components/DurationPicker";

import BackgroundImage from "../../components/BackgroundImage";
import BreathingInstruction from "../../components/BreathingInstructionText";
import LessonBackButton from "../../components/LessonBack";
import FinishCheckMark from "../../components/FinishCheckMark";
import LessonForwardButton from "../../components/LessonForward";
import BackgroundCircle from "../../components/BackgroundCircle"
import FinishButton from "../../components/FinishButton";
import NavigateLesson from "../../components/NavigateLesson";
import Timer from "../../components/Timer";

import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import LessonTitle from "../../components/LessonTitle";
import SettingsButton from "../../components/SettingsButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import TapHandler from "../../components/TapHandler";
import { listenedLesson, listenedIntroLesson, listenedWelcomeLesson, contentFinished, ContentSettings } from "../../redux/actions/contentSettings";

import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import _, { update } from 'lodash';
import CourseTitle from '../../components/CourseTitle';


interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}

interface TrackType {
  id: string,
  url: string,
  artist: string,
  order: number,
  duration: number,
  title: string,
}

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

interface Progress {
  type: AnimationType | null;
  duration: number;
}

let lessonStarted = false;
let introComplete = false;

const DurationList = [...Array(5).keys()].map((i) => i * 3 + 1).filter((item) => item > 1);


const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const selectSettings = (state: RootState) => state.settings;
  const selectContentSettings = (state: RootState) => state.contentSettings;
  const contentSettings: ContentSettings = useSelector(selectContentSettings);
  const allBackgroundMusic = useSelector(selectBackgroundMusic);


  const { id: practiceId, inhaleTime, primaryColor, lessons, introLessons, welcome, thumbnail, totalLessons, name, exhaleTime, backgroundImage, backgroundGradient, } = route.params.guidePractice;


  const practiceSettings = contentSettings[practiceId];
  const backgroundMusic = contentSettings[practiceId] && contentSettings[practiceId].backgroundMusic ? contentSettings[practiceId].backgroundMusic : 'river';
  const vibrationType = contentSettings[practiceId] && contentSettings[practiceId].vibrationType ? contentSettings[practiceId].vibrationType : 'purr_inhale';
  console.log('content settings', contentSettings);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [exerciseDuration, setExerciseDuration] = useState<number>(10);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);

  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [practiceFinished, setPracticeFinished] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>({ type: null, duration: 0 });
  const [iosHapticStatus, setIOSHapticStatus] = useState<boolean>(false);

  const fadeOutAnimation = useRef(new Animated.Value(1)).current;





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

  const handleTrackChangeEvent = async (event) => {
    if (!event.nextTrack) {
      return
    }
    if (!introComplete) {
      introComplete = true;
      return;
    }
    console.log('event', event);
    const lesson = await TrackPlayer.getTrack(event.nextTrack);
    dispatch(listenedLesson(practiceId, lesson.order))
  }

  const handleQueueEndEvent = async (event) => {
    setPracticeFinished(true);
    triggerHaptic();
  }

  const setupEventTracker = () => {
    TrackPlayer.addEventListener('playback-track-changed', handleTrackChangeEvent)
    TrackPlayer.addEventListener('playback-queue-ended', handleQueueEndEvent)
  }


  const setupHaptics = () => {
    if (Platform.OS === 'ios') {
      NativeModules.IOSVibration.getHapticStatus((error: any, resp: boolean) => {
        setIOSHapticStatus(resp)
        if (resp) NativeModules.IOSVibration.prepareHaptics();
      });
    }
  }

  useEffect(() => {
    setupEventTracker();
    setupHaptics();
    return () => {
      TrackPlayer.reset();
      lessonStarted = false;
      introComplete = false;
      stop();
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


  const showTimer = isPaused || optionsVisible;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;
  const hasSwell = backgroundMusic === 'swell';
  const hasBackgroundMusic = backgroundMusic !== 'swell' && backgroundMusic !== null;
  const showBackgroundCircle = (isStopped || isPaused);

  const startExhale = (duration = exhaleTime) => {
    hasSwell && startSwellExhale(exhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Exhale)
    setProgress({ type: AnimationType.ShrinkCircle, duration })
    vibrationType === 'purr_exhale' && startVibration(exhaleTime);
  }

  const exhaleEnd = () => {

  }

  const startInhale = (duration = inhaleTime) => {
    hasSwell && startSwellInhale(inhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Inhale);
    vibrationType === 'purr_inhale' && startVibration(inhaleTime);
    setProgress({ type: AnimationType.ExpandCircle, duration })
  }

  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)
    startTimer();
  }

  const handleTimeSelect = (time: number) => {
    const duration = time * 3 + 1
    setExerciseDuration(duration);
  }


  const getWelcomeTrack = () => {
    const welcomeTrack = {
      url: welcome,
      artist: "Peter",
      title: "Welcome",
      id: "welcome",
      duration: 60,
      order: 0,
    }
    return welcomeTrack;
  }

  const getIntroLesson = (): TrackType => {
    const listenedWelcome = practiceSettings && practiceSettings.listenedWelcome;
    if (listenedWelcome) {
      const lastListenedIntro = practiceSettings.lastIntroLesson

      if (!lastListenedIntro || lastListenedIntro === introLessons.length) {
        const firstLessonOrder = 1
        dispatch(listenedIntroLesson(practiceId, firstLessonOrder))
        return introLessons[0]
      } else {
        const nextLessonOrder = lastListenedIntro + 1;
        dispatch(listenedIntroLesson(practiceId, nextLessonOrder))
        return introLessons[lastListenedIntro]
      }
    }

    const welcomeTrack = getWelcomeTrack();
    dispatch(listenedWelcomeLesson(practiceId))
    return welcomeTrack;
  }

  const reArrangeLessons = (lastLesson: number) => {
    const firstHalf = lessons.slice(lastLesson, lessons.length)
    const secondHalf = lessons.slice(0, lastLesson)
    const updatedLessons = firstHalf.concat(secondHalf)
    return updatedLessons;
  }

  const getLessons = () => {
    const notFirstTimer = practiceSettings && practiceSettings.lastLesson;
    const numberOfLessons = (exerciseDuration - 1) / 3;

    if (notFirstTimer) {
      const lastListenedLesson = practiceSettings.lastLesson;
      if (!lastListenedLesson || lastListenedLesson === lessons.length) {

        return lessons.slice(0, numberOfLessons);

      } else {
        const nextLessonOrder = lastListenedLesson + 1;
        const lessonsUpdate = reArrangeLessons(lastListenedLesson)

        const rearrangedLessons = lessonsUpdate.slice(0, numberOfLessons)
        return rearrangedLessons;
      }
    }
    // for the first timer 
    // if last lesson --> splice and prepareTracks

    return lessons.slice(0, numberOfLessons);

  }

  const startVoiceOver = async () => {
    await TrackPlayer.play()
    hasBackgroundMusic && fadeInBackground();
  }

  const prepareTracks = async () => {
    let allTracks: any = [];
    const introTrack = getIntroLesson();
    const lessonTracks = getLessons();
    allTracks = [introTrack, ...lessonTracks];
    await TrackPlayer.add(allTracks)
    await TrackPlayer.play()
  }

  const handleStart = () => {
    if (!lessonStarted) {
      lessonStarted = true;
      prepareTracks();
    }

    triggerHaptic();
    hasBackgroundMusic && startBackgroundMusic();
    onStartAnimation();
    startVoiceOver();
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

  const stop = () => {
    fadeOutAnimation.setValue(1);
    stopBreathCounter();
    stopTimer();
    hasSwell && stopSwellSound();
    hasBackgroundMusic && stopBackgroundMusic();
    stopVibration();
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
    triggerHaptic();
    stop();
    dispatch(contentFinished(practiceId))
    navigation.goBack()
    TrackPlayer.stop();
  }

  const handleBack = () => {
    !isPaused && stop();
    navigation.goBack()
    TrackPlayer.stop();
  }





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
      {practiceFinished && <FinishCheckMark />}


      {showTimer && <Timer time={time} exerciseDuration={exerciseDuration} />}
      {exerciseNotStarted && <DurationPicker durationList={DurationList} exerciseDuration={(exerciseDuration - 1) / 3} handleTimeSelect={handleTimeSelect} opacity={fadeOutAnimation} />}

      {(isStopped || optionsVisible) &&
        <>
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          {!lessonStarted && <SettingsButton opacity={fadeOutAnimation} handlePress={handlePressSettings} />}

        </>
      }


      <CourseTitle title={name} />
      {activeLesson && <LessonTitle lesson={activeLesson} totalLessons={totalLessons} />}
      <TapHandler handleTap={handleTap} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {showPause && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}

      {practiceFinished && <FinishButton color={primaryColor} handleCourseFinish={handleFinish} />}
      <ProgressBar duration={exerciseDuration} time={time} color={primaryColor} showProgressBar={showProgressBar} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}
      >
        <Settings
          contentId={practiceId} backgroundMusic={backgroundMusic}
          vibrationType={vibrationType}
          showVibrationSettings={true} closeModal={closeSetting}
          color={primaryColor} />
      </Modal>


    </LinearGradient>

  );
}

export default FixedExercise;