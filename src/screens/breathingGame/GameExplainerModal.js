import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const ExplainerModal = ({closeExplainer}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Pick a number of seconds to inhale for each slow calm breath. 
          </Text>
          <Text style={styles.smallText}>
            {'\n'}
            You can change this later in your settings
          </Text>          
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={closeExplainer}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.timeText}>3</Text>
              <Text style={styles.timeTextSmall}>s</Text>
            </View>
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={closeExplainer}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.timeText}>4</Text>
              <Text style={styles.timeTextSmall}>s</Text>
            </View>            
            
          </TouchableOpacity>          
          <TouchableOpacity style={styles.button} onPress={closeExplainer}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.timeText}>5</Text>
              <Text style={styles.timeTextSmall}>s</Text>
            </View>                        
          </TouchableOpacity>  
          <TouchableOpacity style={styles.button} onPress={closeExplainer}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.timeText}>6</Text>
              <Text style={styles.timeTextSmall}>s</Text>
            </View>                        
          </TouchableOpacity>                              
        </View>
      </View>
    </View>
  );
};

export default ExplainerModal;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'rgba(27,31,55,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.4,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
  smallText: {
    fontFamily: FontType.Regular,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,    
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    width:'100%',
    justifyContent: 'space-around',
    flexDirection:'row',
    alignItems:'center',
  },
  button: {
    height: 60,
    width: 65,
    borderRadius: 5,
    backgroundColor: '#3c71de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',    
    lineHeight: 30,
  },
    timeTextSmall: {
    fontFamily: FontType.Medium,
    fontSize: 13,
    color: 'white',
    textAlign: 'center',    
    lineHeight: 27,
    marginLeft:1,
  },
});
