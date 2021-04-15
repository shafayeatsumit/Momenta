import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontType } from '../helpers/theme';
import ModalButton from "../components/ModalButton";
import ExerciseTitle from "../components/ExerciseTitle";

interface Props {
  title: string;
  info: string;
  handleClose: () => void;
}

const jsonEscape = (str: string) => {
  return str.replace(/\\n/g, '\n');
}



const InfoModal: React.FC<Props> = ({ info, title, handleClose }) => {
  return (
    <View style={{ flex: 1 }}>

      <ExerciseTitle title={title} opacity={1} textStyle={{ fontSize: 24 }} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text allowFontScaling={false} style={styles.text}>{info}</Text>
      </ScrollView>

      <View style={styles.closeButton}>
        <ModalButton handlePress={handleClose} >
          <Text allowFontScaling={false} style={styles.buttonText}>DONE</Text>
        </ModalButton>
      </View>

    </View>

  );
}

export default InfoModal;

const styles = StyleSheet.create({
  spacer: {
    // height: 40,
  },
  spacerBottom: {
    // height: 80,
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginTop: 100,
    marginHorizontal: 35,
    padding: 30,
    marginBottom: 10,
    borderRadius: 10,
  },
  settings: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
    fontFamily: FontType.Bold,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
    fontFamily: FontType.Bold,
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontFamily: FontType.Medium,
  },
  closeButton: {
    height: 80,
    width: 80,
    bottom: 20,
    marginVertical: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#979797',
    fontFamily: FontType.Medium,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 15,
  }

});
