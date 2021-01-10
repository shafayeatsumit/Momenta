import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import ModalButton from '../../components/ModalButton'
import { FontType } from '../../helpers/theme';
import RadioButton from "../../components/RadioButton";
import _ from 'lodash';

const VibrationTypes = [
  { id: 'purr_inhale', name: 'Purr On Inhale' },
  { id: 'purr_exhale', name: 'Purr On Exhale' },
]

interface Props {
  color: string;
}

const Vibration: React.FC<Props> = ({ color }) => {
  const OFF = () => (
    <View style={styles.buttonStyle}>
      <RadioButton selected={true} color={color} />
      <Text style={styles.text}>Off</Text>
    </View>
  )
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vibration</Text>
      <ScrollView style={{ flex: 1 }}>
        <OFF />
        {VibrationTypes.map((item) => {
          return (
            <ModalButton key={item.name} handlePress={() => { console.log('item', item.name) }} customStyle={styles.buttonStyle}>
              <RadioButton selected={true} color={color} />
              <Text style={styles.text}>{item.name}</Text>
            </ModalButton>
          )
        })}
      </ScrollView>
    </View>
  );
}

export default Vibration;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginHorizontal: 20,
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
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
    color: 'white',
    paddingLeft: 17,
  },
});
