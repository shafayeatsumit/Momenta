import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ScreenHeight, ScreenWidth } from '../helpers/constants';


interface Props {
  handlePause: () => void;
  disabled: boolean;
}

const ExerciseController: React.FC<Props> = ({ handlePause, disabled }: Props) => {
  return (
    <TouchableOpacity onPress={handlePause} style={styles.button} disabled={disabled} />
  );
}

export default ExerciseController;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ScreenHeight,
  },
});
