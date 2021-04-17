import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ImageBackground, View, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import Listing from './Listing';
import { Lesson } from '../../redux/actions/challenge';
import InfoModal from '../../components/Info';
import AudioPlayer from "./AudioPlayer";
import BackgroundImage from '../../components/BackgroundImage';
import DimBackground from '../../components/DimBackground';

interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}

const Course = ({ route, navigation }: Props) => {
  const { name, lessons, thumbnail, backgroundGradient, info, primaryColor, backgroundImage } = route.params.course;
  const [listingVisible, setListingVisible] = useState<boolean>(true);
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<null | Lesson>(null)

  const handleBack = () => {
    listingVisible ?
      navigation.goBack()
      : setListingVisible(true)
  }

  const handlePressInfo = () => {
    setInfoVisible(true);
  }

  const closeInfo = () => setInfoVisible(false);

  const handleLessonSelect = (item: Lesson) => {
    setListingVisible(false);
    setSelectedLesson(item);
  }

  useEffect(() => {
    if (selectedLesson) {
      // Play the track.
      console.log('play track', selectedLesson.url)
    }
  }, [selectedLesson])
  const showAudioPlayer = !listingVisible && !infoVisible;
  const showListing = listingVisible && !infoVisible;
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
      {showListing && <Listing name={name} handleBack={handleBack} handlePressInfo={handlePressInfo} lessons={lessons} handlePress={handleLessonSelect} />}
      {infoVisible && <InfoModal handleClose={closeInfo} title={name} info={info} />}
      {showAudioPlayer &&
        <AudioPlayer
          courseName={name}
          primaryColor={primaryColor}
          lesson={selectedLesson}
          thumbnail={thumbnail}
          defaultMusic={'off'}
          goBack={handleBack}
          pressInfo={handlePressInfo}
        />
      }

    </LinearGradient>
  )
}

export default Course;