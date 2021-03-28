import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ScreenHeight, ScreenWidth } from '../helpers/constants';


interface Props {
  handleTap: () => void;
  disabled?: boolean;
}

const ExerciseController: React.FC<Props> = ({ handleTap, disabled }: Props) => {
  return (
    <TouchableOpacity onPress={handleTap} style={styles.button} disabled={disabled} />
  );
}

export default ExerciseController;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    // top: 100,
    left: 0,
    right: 0,
    height: ScreenHeight,
    zIndex: 1,
    // backgroundColor: 'yellow',
  },
});
