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

      <ExerciseTitle title={title} opacity={1} />
      <ScrollView style={styles.container}>
        <Text allowFontScaling={false} style={styles.text}>{jsonEscape(info)}</Text>
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
    marginHorizontal: 30,
    padding: 30,
    marginBottom: 80,
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
    fontSize: 18,
    lineHeight: 20,
    color: 'white',
    // alignSelf: 'center',
    fontFamily: FontType.Medium,
  },
  closeButton: {
    // position: 'absolute',
    height: 80,
    width: 80,
    bottom: 20,
    // backgroundColor: 'red',
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
