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

import BackgroundImage from "../../components/BackgroundImage";
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
import { updateContentSettings, contentFinished } from "../../redux/actions/contentSettings";

import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import _, { update } from 'lodash';
import CourseTitle from '../../components/CourseTitle';


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


let navigationListenerId: null | ReturnType<typeof setTimeout> = null;
let lessonStarted = false;




const FixedExercise: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const selectSettings = (state: RootState) => state.settings;
  const selectContentSettings = (state: RootState) => state.contentSettings;
  const contentSettings = useSelector(selectContentSettings);
  const allBackgroundMusic = useSelector(selectBackgroundMusic);
  const settings = useSelector(selectSettings)

  const { id: courseId, inhaleTime, primaryColor, lessons, thumbnail, totalLessons, name, exhaleTime, backgroundImage, backgroundGradient, } = route.params.course;
  // this line needs to be changed;
  const backgroundMusic = contentSettings[courseId] && contentSettings[courseId].backgroundMusic ? contentSettings[courseId].backgroundMusic : null;
  const previouslyListened = contentSettings[courseId];
  const maxListened = contentSettings[courseId] ? contentSettings[courseId].lastLesson : 1;
  const isFinishedOnce = contentSettings[courseId] ? contentSettings[courseId].isFinished : false;
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.NotStarted)
  const [exerciseState, setExerciseState] = useState<ExerciseState>(ExerciseState.NotStarted);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [courseFinished, setCourseFinished] = useState<boolean>(false);

  const { position, duration: lessonDuration } = useTrackPlayerProgress();
  const lessonDurationInMins = Math.round(lessonDuration / 60);
  const renderCount = useRef(0);

  const fadeOutAnimation = useRef(new Animated.Value(1)).current;

  const goToNextLesson = () => {
    TrackPlayer.skipToNext();
    TrackPlayer.pause();
  }
  const goToPreviousLesson = () => {
    TrackPlayer.skipToPrevious();
    TrackPlayer.pause();
  }

  const setupNewLesson = async () => {
    const trackId = await TrackPlayer.getCurrentTrack()
    const lesson = await TrackPlayer.getTrack(trackId);
    setActiveLesson(lesson);

  }

  const updateContent = async () => {
    if (!previouslyListened) {
      dispatch(updateContentSettings(courseId, 1))
      return;
    }

    const trackId = await TrackPlayer.getCurrentTrack()
    const lesson = await TrackPlayer.getTrack(trackId);

    if (isFinishedOnce) {
      console.log('it should be in hrere');
      dispatch(updateContentSettings(courseId, lesson.order))
      return;
    }
    if (lesson && lesson.order > maxListened) {
      dispatch(updateContentSettings(courseId, lesson.order))
    }

  }

  useEffect(() => {
    updateContent();
  }, [activeLesson])

  const initializeLesson = async () => {
    if (previouslyListened) {
      const lastListenedLesson = lessons.find((item) => item.order === maxListened);
      await TrackPlayer.skip(lastListenedLesson.id)
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

  const setupTrackPlayer = () => {
    TrackPlayer.addEventListener('playback-track-changed', async (event) => {

      if (!event.nextTrack) {
        setCourseFinished(true);
        triggerHaptic();
        return
      }
      setupNewLesson();

    })
  }

  useEffect(() => {
    TrackPlayer.add([...lessons]);
    initializeLesson();
    setupTrackPlayer();
    return () => {
      TrackPlayer.reset();
      if (navigationListenerId) {
        clearTimeout(navigationListenerId)
      }
      lessonStarted = false;
      stop();
    }
  }, [])

  const { breathCounter, startBreathCounter, stopBreathCounter } = useBreathCounter(breathCountEnd)

  const exerciseNotStarted = exerciseState === ExerciseState.NotStarted;
  const isPaused = exerciseState === ExerciseState.Paused;
  const isStopped = exerciseState === ExerciseState.NotStarted || exerciseState === ExerciseState.Paused;


  const showTimer = isPaused || optionsVisible;
  const showProgressBar = isPaused || optionsVisible;
  const showPause = optionsVisible && !isStopped;
  const hasSwell = backgroundMusic === 'swell';
  const hasBackgroundMusic = backgroundMusic !== 'swell' && backgroundMusic !== null;
  const showBackgroundCircle = (isStopped || isPaused || optionsVisible);

  const startExhale = (duration = exhaleTime) => {
    hasSwell && startSwellExhale(exhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Exhale)
  }

  const startInhale = (duration = inhaleTime) => {
    hasSwell && startSwellInhale(inhaleTime);
    startBreathCounter(duration)
    setBreathingState(BreathingState.Inhale);
  }

  const startExercise = () => {
    startInhale();
    setExerciseState(ExerciseState.Play)
  }

  const startVoiceOver = async () => {
    await TrackPlayer.play();
    hasBackgroundMusic && fadeInBackground();
  }

  const handleStart = () => {
    if (!lessonStarted) {
      lessonStarted = true;
    }
    triggerHaptic();
    hasBackgroundMusic && startBackgroundMusic();
    startVoiceOver();
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
    triggerHaptic();
    stop();
    dispatch(contentFinished(courseId))
    navigation.goBack()
    TrackPlayer.stop();
  }

  const handleBack = () => {
    !isPaused && stop();
    navigation.goBack()
    TrackPlayer.stop();
  }

  const firstLesson = lessons[0]
  const canGoBack = isStopped && !courseFinished && activeLesson && firstLesson.id !== activeLesson.id;
  let canGoForward = isStopped && (!courseFinished && activeLesson && activeLesson.order < maxListened);

  console.log('bg', backgroundImage)

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
      {courseFinished && <FinishCheckMark />}

      {showTimer && <Timer time={position} exerciseDuration={lessonDurationInMins} />}

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

      {courseFinished && <FinishButton color={primaryColor} handleCourseFinish={handleFinish} />}
      {canGoBack && <LessonBackButton opacity={fadeOutAnimation} handlePress={goToPreviousLesson} />}
      {canGoForward && <LessonForwardButton opacity={fadeOutAnimation} handlePress={goToNextLesson} />}
      {lessonDurationInMins ? <ProgressBar duration={lessonDurationInMins} time={position} color={primaryColor} showProgressBar={showProgressBar} /> : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSetting}
      >
        <Settings vibrationType={null} contentId={courseId} backgroundMusic={backgroundMusic} showVibrationSettings={false} closeModal={closeSetting} color={primaryColor} />
      </Modal>


    </LinearGradient>

  );
}

export default FixedExercise;