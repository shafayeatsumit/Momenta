import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ImageBackground, View, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/reducers";
import { RouteProp } from '@react-navigation/native';
import Listing from './Listing';
import { Lesson } from '../../redux/actions/challenge';
import ExerciseInfo from "../../components/ExerciseInfo";
import InfoModal from '../../components/Info';
import AudioPlayer from "./AudioPlayer";

interface Props {
  route: RouteProp<any, any>;
  navigation: any;
}

const Course = ({ route, navigation }: Props) => {
  const { name, lessons, info, primaryColor, backgroundImage } = route.params.course;
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
    <ImageBackground source={{ uri: backgroundImage }} style={{ height: '100%', width: '100%' }}>

      {showListing && <Listing name={name} handleBack={handleBack} handlePressInfo={handlePressInfo} lessons={lessons} handlePress={handleLessonSelect} />}
      {infoVisible && <InfoModal handleClose={closeInfo} title={name} info={info} />}
      {showAudioPlayer &&
        <AudioPlayer
          courseName={name}
          primaryColor={primaryColor}
          lesson={selectedLesson}
          defaultMusic={'off'}
          goBack={handleBack}
          pressInfo={handlePressInfo}
        />
      }
    </ImageBackground >
  )
}

export default Course;