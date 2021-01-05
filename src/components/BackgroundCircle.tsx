import React from 'react'
import { View, StyleSheet } from 'react-native';
import { ScreenWidth } from "../helpers/constants";


const BackgroundCircle: React.FC<{}> = () => {
  return (
    <View style={styles.absoluteContainer} >
      <View style={{ height: ScreenWidth * .7, width: ScreenWidth * .7, borderRadius: ScreenWidth * .35, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
    </View>
  );
}

export default BackgroundCircle;

const styles = StyleSheet.create({

  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },


});
