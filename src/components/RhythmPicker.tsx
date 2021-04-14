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
          return (
            <TouchableOpacity key={item} style={styles.textContainer} onPress={() => handleRhythmSelect(item)}>
              <Text allowFontScaling={false}
                style={[styles.text,
                slectedRhythm === item ? { fontFamily: FontType.Bold, } : { fontFamily: FontType.Medium, color: 'rgba(255,255,255,0.4)' }
                ]}
              >
                {_.capitalize(item)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <Text style={styles.numberText}>{breathsPerMin}</Text>
      <Text style={styles.numberCaption}> Breaths/Min</Text>
    </View>


  );
}
export default RhythmPicker;
const styles = StyleSheet.create({

  numberText: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: FontType.SemiBold,
    color: 'white',
    position: 'absolute',
    bottom: 0,
  },
  numberCaption: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: FontType.Medium,
    color: 'white',
    position: 'absolute',
    bottom: 6,
    right: 30,
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
    fontSize: 18,
    // lineHeight: 28,
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
