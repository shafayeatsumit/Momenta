import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { BreathingState, ControllerButton } from "../helpers/types";
import { ScreenHeight, ScreenWidth } from '../helpers/constants';
import { FontType, Colors } from '../helpers/theme';


interface Props {
  buttonState: ControllerButton | null;
  handlePause: () => void;
  handleContinue: () => void;
  handleFinish: () => void;
}



const ExerciseController: React.FC<Props> = ({ buttonState, handleContinue, handleFinish, handlePause }: Props) => {
  const showContinue = buttonState === ControllerButton.Continue;
  const showPause = buttonState === ControllerButton.Pause || buttonState === ControllerButton.Start;
  const showFinish = buttonState === ControllerButton.Finish;
  return (
    <>
      {showPause &&
        <TouchableOpacity style={styles.button} onPress={handlePause} >
          <Text style={styles.buttonText}>PAUSE</Text>
        </TouchableOpacity>
      }
      {showContinue &&
        <TouchableOpacity style={styles.button} onPress={handleContinue} >
          <Text style={styles.buttonText}> CONTINUE</Text>
        </TouchableOpacity>
      }
      {showFinish &&
        <TouchableOpacity style={styles.button} onPress={handleFinish} >
          <Text style={styles.buttonText}> FINISH </Text>
        </TouchableOpacity>
      }
    </>
  );
}

export default ExerciseController;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    height: 50,
    width: 150,
    // backgroundColor: Colors.buttonBlue,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FontType.Medium,
    color: 'white',
  },
});
