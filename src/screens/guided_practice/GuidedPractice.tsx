import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, ImageBackground, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer, { useTrackPlayerProgress, usePlaybackState } from 'react-native-track-player';
import BreathingProgress from "../../components/BreathingProgress";
import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import Settings from '../settings/Settings';
import { startSwellExhale, startSwellInhale, stopSwellSound } from "../../helpers/SoundPlayer";
import { playBackgroundMusic, fadeInBackground, stopBackgroundMusic } from "../../helpers/LessonPlayer";
import ProgressBar from './ProgressBar';
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

enum AudioState {
  PLAYING = "playing",
  STOPPED = "stopped",
}


const GuidedPractice: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;
  const { id: practiceId, duration, primaryColor, backgroundImage, file, name: practiceName, info, summary, defaultMusic } = route.params.guidePractice;
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<AudioState>(AudioState.STOPPED)
  const { position, duration: trackDuration } = useTrackPlayerProgress();
  const playbackState = usePlaybackState();
  console.log(`playbackState ${playbackState}`)
  const handleFinish = () => {
    triggerHaptic();
    handleBack();
  }



  const handleBack = () => {
    navigation.goBack()
    TrackPlayer.stop();
  }

  const prepareTrack = () => {
    const track = {
      id: practiceId,
      url: file,
      artist: "",
      duration: duration,
      title: practiceName,
    }
    TrackPlayer.add([track])
  }

  const handleQueueEndEvent = () => {
    TrackPlayer.stop();
  }

  useEffect(() => {
    prepareTrack();
    // TrackPlayer.addEventListener('playback-queue-ended', handleQueueEndEvent)

  }, [])


  const showOptions = () => {
    if (!optionsVisible) {
      setOptionsVisible(true);
      hideOptions();
    }
  }

  const handleTap = () => {
    showOptions();
    console.log('show handler tap');
  }
  const handleStart = () => {
    triggerHaptic();
    TrackPlayer.play();
    setAudioState(AudioState.PLAYING);
  }

  const handlePause = () => {
    setAudioState(AudioState.STOPPED);
    triggerHaptic();
    TrackPlayer.pause();
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

  const isStopped = audioState === AudioState.STOPPED;
  const isPlaying = audioState === AudioState.PLAYING;

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>
      <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
      <CourseTitle title={practiceName} />

      <BackgroundCircle opacity={fadeOutAnimation} />
      <ProgressBar duration={trackDuration} time={position} color={primaryColor} showProgressBar />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {isPlaying && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}

    </ImageBackground>
  );
}

export default GuidedPractice;

const styles = StyleSheet.create({
  bgImage: {
    height: '100%',
    width: '100%',
  }
})