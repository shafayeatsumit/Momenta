import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontType } from '../helpers/theme';
import ModalButton from "../components/ModalButton";

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
      <View style={styles.spacer} />
      <Text allowFontScaling={false} style={styles.settings}>{title}</Text>

      <ScrollView style={styles.scrollView}>
        <Text allowFontScaling={false} style={styles.title}>About</Text>
        <Text allowFontScaling={false} style={styles.text}>{jsonEscape(info)}</Text>
      </ScrollView>
      <View style={styles.spacerBottom} />
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
    height: 40,
  },
  spacerBottom: {
    height: 80,
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
    fontSize: 15,
    lineHeight: 20,
    color: 'white',
    // alignSelf: 'center',
    fontFamily: FontType.Regular,
  },
  closeButton: {
    position: 'absolute',
    height: 50,
    width: 80,
    bottom: 30,
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
