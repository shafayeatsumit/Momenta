import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { ScreenHeight, ScreenWidth } from '../../helpers/constants';
import { FontType } from '../../helpers/theme';
import { Lesson } from "../../redux/actions/course";
import Header from "../../screens/challenge/Header";
import moment from 'moment';
import _ from 'lodash';

interface Props {
  lessons: Lesson[],
  handlePress: Function,
  handleBack: Function,
  handlePressInfo: Function,
  name: string,
}

const ICONS = {
  'finished': require('../../../assets/images/finish.png'),
  'unlocked': require('../../../assets/images/unchecked.png'),
}

const Listing = ({ lessons, handlePress, name, handlePressInfo, handleBack }: Props) => {
  const selectSettings = (state: RootState) => state.courseSettings;
  const settings = useSelector(selectSettings)

  const getLessonStateus = (lesson: any) => {
    const isFinished = _.get(settings, `${name}.${lesson.id}.finished`, false)
    if (isFinished) {
      return 'finished'
    }
    return 'unlocked'
  }

  const renderItem = ({ item }) => {
    const lessonStatus = getLessonStateus(item)
    const formattedDuration = (secs: number) => moment.utc(secs * 1000).format('m.ss');
    return (
      <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={() => handlePress(item)}>
        <View style={{ flexDirection: 'row', flex: 3, }}>
          <Image source={ICONS[lessonStatus]} style={{ resizeMode: 'contain', height: 22, width: 24, marginHorizontal: 10 }} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.duration}>{formattedDuration(item.duration)} mins</Text>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Header title={name} handleBack={handleBack} handlePressInfo={handlePressInfo} opacity={1} />
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={lessons}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default Listing;

const styles = StyleSheet.create({
  container: {
    marginTop: 120,
    height: ScreenHeight * .80,
  },
  item: {
    // height: 60,
    paddingVertical: 20,
    width: ScreenWidth * .85,
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
    flexShrink: 1,
  },
  duration: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 13,
  }

});
