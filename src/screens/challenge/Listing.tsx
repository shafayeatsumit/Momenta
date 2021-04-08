import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { ScreenWidth } from '../../helpers/constants';
import { FontType } from '../../helpers/theme';
import { Lesson } from "../../redux/actions/challenge";
import Header from "./Header";

interface Props {
  lessons: Lesson[],
  handlePress: Function,
  handleBack: Function,
  handlePressInfo: Function,
  name: string,
}

const Listing = ({ lessons, handlePress, name, handlePressInfo, handleBack }: Props) => {

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={() => handlePress(item)}>
        <View style={{ flexDirection: 'row', flex: 3, }}>
          <Image source={require('../../../assets/images/finish.png')} style={{ resizeMode: 'contain', height: 22, width: 24, marginHorizontal: 10 }} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.duration}>{item.duration} mins</Text>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Header title={name} handleBack={handleBack} handlePressInfo={handlePressInfo} opacity={1} />
      <FlatList
        contentContainerStyle={styles.container}
        data={lessons}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

    </View>
  )
}

export default Listing;

const styles = StyleSheet.create({
  container: {
    marginTop: 130,
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
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 16,
  }

});
