import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, ImageBackground, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress, usePlaybackState } from 'react-native-track-player';
import { triggerHaptic } from "../../helpers/hapticFeedback";
import MusicPicker from '../../components/MusicPicker';
import { playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import ProgressBar from '../guided_practice/ProgressBar';
import BackgroundCircle from "../../components/BackgroundCircle"
import FinishButton from "../../components/FinishButton";
import Header from "./Header";
import DimBackground from "../../components/DimBackground"
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import TapHandler from "../../components/TapHandler";
import { RootState } from "../../redux/reducers";
import { changeChallengeBackground, finishedChallengeLesson } from "../../redux/actions/challengeSettings";
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import CourseTitle from '../../components/CourseTitle';
import { Lesson } from '../../redux/actions/challenge';


interface Props {
  primaryColor: string;
  lesson: Lesson;
  defaultMusic: string;
  goBack: Function;
  pressInfo: Function;
  challengeName: string;
}

const MusicList = ['flying', 'wave', 'off', 'river', 'rain'];


const GuidedPractice: React.FC<Props> = ({ primaryColor, challengeName, lesson, defaultMusic, goBack, pressInfo }: Props) => {
  const dispatch = useDispatch();
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;
  const selectSettings = (state: RootState) => state.challengeSettings;
  const settings = useSelector(selectSettings)

  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [lesonDuration, setLessonDuration] = useState<number>(0);

  const { position, duration: trackDuration } = useTrackPlayerProgress();
  const playbackState = usePlaybackState();
  const isStopped = playbackState !== TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_NONE;
  const isPlaying = playbackState === TrackPlayer.STATE_PLAYING;

  const backgroundMusic = _.get(settings, `${challengeName}.backgroundMusic`, defaultMusic);
  const isFinished = _.get(settings, `${challengeName}.${lesson.id}.finished`, false)

  useTrackPlayerEvents(["playback-queue-ended"], async event => {
    if (!isFinished) {
      dispatch(finishedChallengeLesson(challengeName, lesson.id));
    }
    handleBack();
  });


  const onStartAnimation = () => {
    Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      TrackPlayer.play();
      if (Platform.OS === 'android') {
        startBackgroundMusic();
      }
    });
  }

  const handleBack = () => {
    TrackPlayer.stop();
    stopBackgroundMusic();
    goBack();
  }


  const prepareTrack = async () => {
    // TODO: change this later  
    const track = {
      ...lesson,
      artist: "",
      title: lesson.title,
    }
    setLessonDuration(track.duration);
    await TrackPlayer.add([track])
  }



  useEffect(() => {
    prepareTrack();
    return () => {
      stopBackgroundMusic();
      TrackPlayer.reset();
    }
  }, [])


  const showOptions = () => {
    if (!optionsVisible) {
      fadeOutAnimation.setValue(1);
      setOptionsVisible(true);
      hideOptions();
    }
  }

  const handleTap = () => {
    // audio is playing but options are not visible.
    const canShowOptions = isPlaying && !optionsVisible;
    if (canShowOptions) {
      showOptions();
    }
  }

  const handleStart = () => {
    triggerHaptic();
    onStartAnimation();
    setOptionsVisible(false);
  }

  const handlePause = () => {
    triggerHaptic();
    TrackPlayer.pause();
    fadeOutAnimation.setValue(1);
    setOptionsVisible(true);
  }


  const handlePressInfo = () => {
    const isPaused = playbackState === TrackPlayer.STATE_PAUSED;
    if (!isPaused) {
      handlePause();
    }
    pressInfo();
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

  const startBackgroundMusic = () => {
    if (backgroundMusic) {
      playBackgroundMusic(`${backgroundMusic}.wav`);

    }
  }

  const handleMusicSelect = (music: string) => {
    dispatch(changeChallengeBackground(challengeName, music))
  }

  useEffect(() => {
    stopBackgroundMusic();
    startBackgroundMusic();
  }, [backgroundMusic])

  return (
    <View style={styles.container}>
      <DimBackground exerciseState={playbackState} />
      <Header title={lesson.title} handleBack={handleBack} handlePressInfo={handlePressInfo} opacity={fadeOutAnimation} />
      <ProgressBar duration={lesonDuration} time={position} color={primaryColor} />
      {isStopped || optionsVisible ?
        <BackgroundCircle opacity={fadeOutAnimation} />
        : null
      }

      <TapHandler handleTap={handleTap} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {isPlaying && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}
      {isStopped && <MusicPicker musicList={MusicList} containerStyle={{ bottom: 200 }} selectedMusic={backgroundMusic} handleMusicSelect={handleMusicSelect} opacity={fadeOutAnimation} />}
      {showTimer && <FinishButton containerStyle={{ bottom: 140 }} handleFinish={handleBack} />}
    </View>
  );
}

export default GuidedPractice;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: 'red',
  }
})