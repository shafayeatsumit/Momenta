import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import ModalButton from '../../components/ModalButton'
import { FontType } from '../../helpers/theme';
import RadioButton from "../../components/RadioButton";
import { RootState } from "../../redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import { changeMusic } from "../../redux/actions/settings";
import { eventButtonPush } from "../../helpers/analytics";
import { updateContentBackgroundMusic } from "../../redux/actions/contentSettings";

import _ from 'lodash';

interface Props {
  color: string;
  courseId?: string;
  backgroundMusic: string | null;
}

const Sound: React.FC<Props> = ({ color, backgroundMusic, courseId }) => {
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const dispatch = useDispatch();
  const musicFiles = _.values(useSelector(selectBackgroundMusic));

  const getMusicName = (id: string | null) => {
    if (id === null) {
      return 'off'
    }
    if (id === 'swell') {
      return 'swell'
    }
    const musicName = musicFiles.find((item) => item.id === id).name
    return musicName;
  }

  const handlePress = (id: string | null) => {
    const eventTitle = getMusicName(id);
    eventButtonPush(`sound_settings_${eventTitle}`);

    if (courseId) {
      dispatch(updateContentBackgroundMusic(courseId, id));
      return;
    }
    dispatch(changeMusic(id))

  }

  const OFF = () => (
    <ModalButton handlePress={() => handlePress(null)} customStyle={styles.buttonStyle}>
      <RadioButton selected={backgroundMusic === null} color={color} />
      <Text allowFontScaling={false} style={styles.text}>Off</Text>
    </ModalButton>
  )

  const SWELL = () => (
    <ModalButton handlePress={() => handlePress('swell')} customStyle={styles.buttonStyle}>
      <RadioButton selected={backgroundMusic === 'swell'} color={color} />
      <Text allowFontScaling={false} style={styles.text}>Swell</Text>
      <View style={[styles.recHolder, { backgroundColor: color }]}>
        <Text allowFontScaling={false} style={styles.rec}>Recommended</Text>
      </View>
    </ModalButton>
  )


  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>Sound</Text>
      <ScrollView style={{ flex: 1 }}>
        <OFF />
        <SWELL />
        {musicFiles.map((item) => {
          return (
            <ModalButton key={item.name} handlePress={() => handlePress(item.id)} customStyle={styles.buttonStyle}>
              <RadioButton selected={backgroundMusic === item.id} color={color} />
              <Text allowFontScaling={false} style={styles.text}>{item.name}</Text>
            </ModalButton>
          )
        })}
      </ScrollView>
    </View>
  );
}

export default Sound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginLeft: 30,
    marginVertical: 10,
    marginTop: 20,
  },
  buttonStyle: {
    height: 50, width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
    color: 'white',
    fontFamily: FontType.Bold,
    alignSelf: 'flex-start'
  },
  recHolder: {
    position: 'absolute',
    right: 0,
    padding: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  rec: {
    fontFamily: FontType.Regular,
    fontSize: 10,
    color: 'white',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
    color: 'white',
    paddingLeft: 17,
  }

});
