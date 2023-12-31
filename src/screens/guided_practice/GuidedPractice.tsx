import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, ImageBackground, Easing, Modal, Text, Platform, View, NativeModules } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import TrackPlayer, { useTrackPlayerEvents, useTrackPlayerProgress, usePlaybackState } from 'react-native-track-player';
import { triggerHaptic } from "../../helpers/hapticFeedback";
import { RootState } from "../../redux/reducers";
import InfoModal from "../../components/Info";
import MusicPicker from '../../components/MusicPicker';
import { playBackgroundMusic, stopBackgroundMusic } from "../../helpers/SoundPlayer";
import ProgressBar from './ProgressBar';
import { findNextTrack } from "../../helpers/common";
import BackgroundCircle from "../../components/BackgroundCircle"
import FinishButton from "../../components/FinishButton";
import SleepTimer from "./SleepTimer";
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";
import TapHandler from "../../components/TapHandler";
import DimBackground from "../../components/DimBackground";

import { changePracticeMusic, updateLastPractice } from "../../redux/actions/guidedPracticeSettings";
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import CourseTitle from '../../components/CourseTitle';
import { FontType } from '../../helpers/theme';
import Thumbnail from '../home/CourseThumbnail';


interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}
const MusicList = ['flying', 'wave', 'off', 'river', 'rain'];

let expiryTime = null;

const GuidedPractice: React.FC<Props> = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;


  const { id: practiceId, thumbnail, primaryColor, backgroundImage, tracks, name: practiceName, info, summary, defaultMusic } = route.params.guidePractice;
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [exerciseStarted, setExerciseStarted] = useState<boolean>(false);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [lessonDuration, setLessonDuration] = useState<number>(0);
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
    dispatch(updateLastPractice(practiceName, currentTrack));
    if (practiceName === 'sleep') {

      expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + 300);
      setShowTimer(true);
    } else {
      handleBack();
    }

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
      artwork: thumbnail,
      artist: "",
    }
    setCurrentTrack(track.id);
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
    if (!exerciseStarted) {
      setExerciseStarted(true)
    }
  }

  const handlePause = () => {
    triggerHaptic();
    TrackPlayer.pause();
    fadeOutAnimation.setValue(1);
    setOptionsVisible(true);
  }

  const closeInfoModal = () => setInfoModalVisible(false);
  const handlePressInfo = () => {
    const isPaused = playbackState === TrackPlayer.STATE_PAUSED;
    if (!isPaused) {
      handlePause();
    }
    setInfoModalVisible(true);
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
  const showModal = infoModalVisible;

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>
      <DimBackground exerciseState={playbackState} />
      {!showModal ?
        <>
          <ProgressBar duration={lessonDuration} time={position} color={primaryColor} />
          {showTimer && <SleepTimer onExpire={handleBack} expiryTimestamp={expiryTime} />}
          <ExerciseInfo opacity={fadeOutAnimation} handlePress={handlePressInfo} />

          {!exerciseStarted &&
            <View style={styles.summaryContainer}>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          }

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
          {isStopped && <MusicPicker musicList={MusicList} containerStyle={{ bottom: 200 }} selectedMusic={backgroundMusic} handleMusicSelect={handleMusicSelect} opacity={fadeOutAnimation} />}
          {showTimer && <FinishButton containerStyle={{ bottom: 140 }} handleFinish={handleBack} />}
        </>
        :
        <Modal
          animationType="fade"
          transparent={true}
          visible={infoModalVisible}
          onRequestClose={closeInfoModal}
        >
          <InfoModal
            title={practiceName}
            info={info}
            handleClose={closeInfoModal}
          />
        </Modal>

      }

    </ImageBackground>
  );
}

export default GuidedPractice;

const styles = StyleSheet.create({
  bgImage: {
    height: '100%',
    width: '100%',
  },
  summaryContainer: {
    position: 'absolute',
    top: 150,
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  summary: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontType.Regular,
    textAlign: 'left',
  },

})