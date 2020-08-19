import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Home.styles';

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Calm</Text>
          </View>
          <View style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>10 breaths</Text>
          </View>
          <View style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Pulse</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonActive]}
            onPress={() => {}}>
            <Text style={[styles.buttonText]}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Home;
