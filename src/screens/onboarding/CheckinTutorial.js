import React, {useState} from 'react';

import {ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
import {View, Text, StyleSheet} from 'react-native';
import ButtonBig from '../home/ButtonBig';
import {useDispatch} from 'react-redux';

const CheckinTutorial = (props) => {
  const dispatch = useDispatch();
  const [showVideo, setVideo] = useState(false);
  if (showVideo) {
    return (
      <View style={styles.main}>
        <View style={styles.topTextHolder}>
          <Text style={styles.text} allowFontScaling={false}>
            Measure your current{' '}
            <Text style={styles.textBold} allowFontScaling={false}>
              exhale
            </Text>{' '}
            and inhale length and then use the pacer adjust your rhythm
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonBig
            handlePress={() => {
              const {navigation} = props;
              const {handleMusic, navRoute} = props.route.params;
              dispatch({type: 'ONBOARDING_DONE'});
              navigation.replace(navRoute, {handleMusic});
            }}
            title="I am ready"
            buttonColor={Colors.cornflowerBlue}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.centerTextHolder}>
        <Text style={styles.text}>
          Calmer breathing {'\n'}focuses on slower, longer{' '}
          <Text style={styles.textBold}>exhales</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonBig
          handlePress={() => {
            setVideo(true);
          }}
          title="Next"
          buttonColor={Colors.cornflowerBlue}
        />
      </View>
    </View>
  );
};
export default CheckinTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  centerTextHolder: {
    paddingHorizontal: 30,
  },
  topTextHolder: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
  text: {
    fontFamily: FontType.Medium,
    fontSize: 24,
    color: 'white',
    lineHeight: 32,
  },
  textBold: {
    fontFamily: FontType.ExtraBold,
    fontSize: 24,
    color: Colors.cornflowerBlue,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
    width: ScreenWidth,
    height: 50,
  },
});
