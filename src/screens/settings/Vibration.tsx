import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import ModalButton from '../../components/ModalButton'
import { FontType } from '../../helpers/theme';
import RadioButton from "../../components/RadioButton";
import { RootState } from "../../redux/reducers";
import { changeVibration } from "../../redux/actions/settings";
import { useSelector, useDispatch } from "react-redux";
import { eventButtonPush } from "../../helpers/analytics";
import { updateContentVibrationType } from "../../redux/actions/contentSettings";
import _ from 'lodash';

const VibrationTypes = [
  { id: 'purr_inhale', name: 'Purr On Inhale' },
  { id: 'purr_exhale', name: 'Purr On Exhale' },
]

interface Props {
  color: string;
  courseId?: string;
  vibrationType: string | null;
}

const Vibration: React.FC<Props> = ({ color, vibrationType, courseId }) => {
  const dispatch = useDispatch();
  // const selectSettings = (state: RootState) => state.settings;
  // const vibrationType = useSelector(selectSettings).vibrationType;

  const handlePress = (id: string | null) => {
    const eventName = id !== null ? id : 'off';
    eventButtonPush(`vibration_settings_${eventName}`)
    if (courseId) {
      dispatch(updateContentVibrationType(courseId, id));
      return;
    }

    dispatch(changeVibration(id))
  }

  const OFF = () => (
    <ModalButton handlePress={() => handlePress(null)} customStyle={styles.buttonStyle}>
      <RadioButton selected={vibrationType === null} color={color} />
      <Text allowFontScaling={false} style={styles.text}>Off</Text>
    </ModalButton>
  )
  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>Vibration</Text>
      <ScrollView style={{ flex: 1 }}>
        <OFF />
        {VibrationTypes.map((item) => {
          return (
            <ModalButton key={item.name} handlePress={() => handlePress(item.id)} customStyle={styles.buttonStyle}>
              <RadioButton selected={vibrationType === item.id} color={color} />
              <Text allowFontScaling={false} style={styles.text}>{item.name}</Text>
              {item.id === 'purr_inhale' &&
                <View style={[styles.recHolder, { backgroundColor: color }]}>
                  <Text allowFontScaling={false} style={styles.rec}>Recommended</Text>
                </View>

              }
            </ModalButton>
          )
        })}
      </ScrollView>
    </View>
  );
}

export default Vibration;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    marginLeft: 30,
    marginTop: 20,
  },
  buttonStyle: {
    height: 50, width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
    color: 'white',
    fontFamily: FontType.Bold,
    alignSelf: 'flex-start'
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
    color: 'white',
    paddingLeft: 17,
  },
  recHolder: {
    position: 'absolute',
    right: 0,
    padding: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  rec: {
    fontFamily: FontType.Regular,
    fontSize: 10,
    color: 'white',
  },
});
