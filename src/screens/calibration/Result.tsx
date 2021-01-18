import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import CenterContainer from "../../components/CenterContainer";
import { FontType } from '../../helpers/theme';
import Button from "../../components/ButtonMd";
import { triggerHaptic } from "../../helpers/hapticFeedback";
import { eventButtonPush } from '../../helpers/analytics';

interface Props {
  handleRedo: () => void;
  handleContinue: () => void;
  inhaleDuration: number;
  exhaleDuration: number;
  primaryColor: string;
}

const Result: React.FC<Props> = ({ primaryColor, inhaleDuration, exhaleDuration, handleRedo, handleContinue }) => {
  const rhythm = Math.round(60 / (inhaleDuration + exhaleDuration));
  const continuePress = () => {
    triggerHaptic();
    handleContinue();
    eventButtonPush('calibration_done');
  }

  const redoPress = () => {
    handleRedo();
    eventButtonPush('calibration_redo');
  }

  return (
    <View style={styles.main}>
      <CenterContainer>
        <Text allowFontScaling={false} style={styles.text}>{inhaleDuration}s inhale</Text>
        <Text allowFontScaling={false} style={styles.text}>{exhaleDuration}s exhale</Text>
        <Text allowFontScaling={false} style={[styles.text, { marginTop: 10 }]}>{rhythm} breaths per minute</Text>
      </CenterContainer>
      <View style={styles.buttonContainer}>
        <Button title={"REDO"} handlePress={redoPress} />
        <Button
          title={"CONTINUE"}
          containerStyle={{ backgroundColor: primaryColor }}
          handlePress={continuePress}
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
