import React from 'react'
import { Animated, TouchableOpacity, ScrollView, Text, View, StyleSheet } from 'react-native';
import _ from 'lodash';
import { FontType } from "../helpers/theme";

interface Props {
  slectedRhythm: string;
  breathsPerMin: number;
  handleRhythmSelect: (time: string) => void;
  rhythmList: string[],

}

const RhythmPicker: React.FC<Props> = ({ breathsPerMin, slectedRhythm, handleRhythmSelect, rhythmList }: Props) => {

  return (

    <View style={styles.container}>
      <ScrollView horizontal={true} >
        {rhythmList.map((item: string) => {
          console.log(`item ${item}`)
          return (
            <TouchableOpacity key={item} style={styles.textContainer}>
              <Text style={[styles.text, slectedRhythm === item && { fontFamily: FontType.ExtraBold, }]}>
                {_.capitalize(item)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <Text style={styles.numberText}>{breathsPerMin}</Text>
      <Text style={styles.numberCaption}>Breaths/Min</Text>
    </View>


  );
}
export default RhythmPicker;
const styles = StyleSheet.create({

  numberText: {
    textAlign: 'center',
    fontSize: 35,
    fontFamily: FontType.SemiBold,
    color: 'white',
    position: 'absolute',
    bottom: 0,
  },
  numberCaption: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FontType.Medium,
    color: 'white',
    position: 'absolute',
    bottom: 10,
    right: 35,
  },
  textContainer: {
    width: 100,
    height: 60,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    color: 'white',
    fontFamily: FontType.Medium,

  },
  container: {
    height: 100,
    width: 320,
    position: 'absolute',
    bottom: 85,
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  }

});
