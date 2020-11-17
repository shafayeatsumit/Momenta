import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';
import ButtonSmall from '../../components/ButtonSmall';

const CheckinError = ({error, handleRedo, handleSkip}) => (
  <View style={styles.container}>
    <Text allowFontScaling={false} style={styles.title}>
      Calibration
    </Text>
    <Text allowFontScaling={false} style={styles.error}>
      {error}
    </Text>
    <View allowFontScaling={false} style={styles.buttonHolder}>
      <ButtonSmall title={'REDO'} handlePress={handleRedo} />
      <ButtonSmall
        title={'SKIP'}
        handlePress={handleSkip}
        containerStyle={{backgroundColor: Colors.betterBlue}}
        titleStyle={{color: Colors.buttonBlue}}
      />
    </View>
  </View>
);
export default CheckinError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.betterBlue,
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    top: 30,
  },
  error: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    color: 'white',
    paddingLeft: 40,
    paddingRight: 100,
  },
  buttonHolder: {
    position: 'absolute',
    bottom: 40,
    height: 60,
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
});
