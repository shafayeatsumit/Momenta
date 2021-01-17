import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import CenterContainer from "../../components/CenterContainer";
import { FontType } from '../../helpers/theme';
import Button from "../../components/ButtonMd";

interface Props {
  handleRedo: () => void;
  handleContinue: () => void;
  inhaleDuration: number;
  exhaleDuration: number;
  primaryColor: string;
}

const Result: React.FC<Props> = ({ primaryColor, inhaleDuration, exhaleDuration, handleRedo, handleContinue }) => {
  const rhythm = Math.round(60 / (inhaleDuration + exhaleDuration));

  return (
    <View style={styles.main}>
      <CenterContainer>
        <Text style={styles.text}>{inhaleDuration} inhale</Text>
        <Text style={styles.text}>{exhaleDuration} exhale</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>{rhythm} breaths per minute</Text>
      </CenterContainer>
      <View style={styles.buttonContainer}>
        <Button title={"REDO"} handlePress={handleRedo} />
        <Button
          title={"CONTINUE"}
          containerStyle={{ backgroundColor: primaryColor }}
          handlePress={handleContinue}
        />
      </View>

    </View>
  );
}

export default Result;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  text: {
    fontFamily: FontType.Medium,
    fontSize: 22,
    paddingTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    height: 50,
    width: 250,
    alignSelf: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  }
});
