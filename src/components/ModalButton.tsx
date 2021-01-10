import React from 'react'
import { StyleSheet, TouchableOpacity as ButtonAndroid, Platform, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity as ButtonIOS } from 'react-native-gesture-handler'

// silly RN bug: TouchableOpacity doesn't work on IOS;

interface Props {
  handlePress: () => void;
  children: React.ReactNode;
  customStyle?: StyleProp<ViewStyle>;
}

const ModalButton: React.FC<Props> = ({ handlePress, children, customStyle }) => {
  if (Platform.OS === 'android') {
    return <ButtonAndroid style={[styles.button, customStyle && customStyle]} onPress={handlePress}>
      {children}
    </ButtonAndroid>
  }
  return (
    <ButtonIOS style={[styles.button, customStyle && customStyle]} onPress={handlePress}>
      {children}
    </ButtonIOS>
  );
}

export default ModalButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  }
});
