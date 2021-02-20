import React from 'react'
import { StyleSheet, View, Image } from 'react-native';

interface Props {

}

const FinishCheckMark: React.FC = ({ }) => {
  return (
    <View>
      <Image source={require("../../assets/images/checkmark.png")} style={styles.checkmark} />
    </View>
  );
}

export default FinishCheckMark;

const styles = StyleSheet.create({
  checkmark: {
    position: 'absolute',
    top: 220,
    alignSelf: 'center',
    height: 30,
    width: 30,
    resizeMode: 'contain',
  }
});
