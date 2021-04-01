import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, ImageBackground, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer, { TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress, usePlaybackState } from 'react-native-track-player';
import BreathingProgress from "../../components/BreathingProgress";
import { triggerHaptic } from "../../helpers/hapticFeedback";
import useBreathCounter from "../../hooks/useBreathCounter";
import useTimer from "../../hooks/useTimer";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import SettingsScreen from '../settings/Settings';
import MusicPicker from '../../components/MusicPicker';
import { startSwellExhale, startSwellInhale, stopSwellSound } from "../../helpers/SoundPlayer";
import { playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import ProgressBar from './ProgressBar';
import DurationPicker from "../../components/DurationPicker";
import { findNextTrack } from "../../helpers/common";
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

import { changePracticeMusic, updateLastPractice } from "../../redux/actions/guidedPracticeSettings";
import { BreathingState, ExerciseState } from "../../helpers/types";
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import _, { update } from 'lodash';
import CourseTitle from '../../components/CourseTitle';


interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}
const MusicList = ['wind', 'off', 'river', 'rain'];

const GuidedPractice: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;
  const { id: practiceId, duration, primaryColor, backgroundImage, tracks, name: practiceName, info, summary, defaultMusic } = route.params.guidePractice;
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  //TODO: fetch it from global.


  const selectSettings = (state: RootState) => state.guidedPracticeSettings;
  const settings = useSelector(selectSettings)

  const { position, duration: trackDuration } = useTrackPlayerProgress();
  const playbackState = usePlaybackState();
  const isStopped = playbackState !== TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_NONE;
  const isPlaying = playbackState === TrackPlayer.STATE_PLAYING;

  const backgroundMusic = _.get(settings, `${practiceName}.backgroundMusic`, defaultMusic);
  const lastPlayedTrack = _.get(settings, `${practiceName}.lastPlayed`, null);

  useTrackPlayerEvents(["playback-queue-ended"], async event => {
    console.log('going back');
    dispatch(updateLastPractice(practiceName, currentTrack));
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
    navigation.goBack();
    TrackPlayer.stop();
    stopBackgroundMusic();
  }

  const getTrack = () => {
    const trackIndex = findNextTrack(tracks, lastPlayedTrack)
    const track = tracks[trackIndex];
    return track
  }

  const prepareTrack = async () => {
    // TODO: change this later
    let track = getTrack();

    track = {
      ...track,
      artist: "",
      title: track.name,
    }
    setCurrentTrack(track.id);
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
    dispatch(changePracticeMusic(practiceName, music))
  }

  useEffect(() => {
    stopBackgroundMusic();
    startBackgroundMusic();
  }, [backgroundMusic])

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>
      <ProgressBar duration={trackDuration} time={position} color={primaryColor} />

      {isStopped || optionsVisible ?
        <>
          <BackButton handlePress={handleBack} opacity={fadeOutAnimation} />
          <CourseTitle title={practiceName} />
          <BackgroundCircle opacity={fadeOutAnimation} />
        </> : null
      }

      <TapHandler handleTap={handleTap} />
      {isStopped && <PlayButton handleStart={handleStart} buttonOpacity={fadeOutAnimation} />}
      {isPlaying && <PauseButton handlePause={handlePause} buttonOpacity={fadeOutAnimation} />}
      {isStopped && <MusicPicker musicList={MusicList} containerStyle={{ bottom: 130 }} selectedMusic={backgroundMusic} handleMusicSelect={handleMusicSelect} opacity={fadeOutAnimation} />}

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