import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {handleTagSelect} from '../../../redux/actions/tag';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import Swiper from 'react-native-swiper';
import Tag from '../../settings/Tag';
import {useSelector, useDispatch} from 'react-redux';

const MeditationExplainer = ({closeModal}) => {
  const tagNames = useSelector((state) => state.tagNames);
  const dispatch = useDispatch();
  const selectedTags = useSelector((state) => state.settings).selectedTags;
  const isDisabledButton = selectedTags.length < 1;
  const handleTagPress = (tagId) => {
    dispatch(handleTagSelect(tagId));
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            You can end with a short meditation {'\n'}
          </Text>
          <Text style={styles.text}>
            Pick positive emotions you’d want to enjoy after calm breathing
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          {tagNames.map((item) => (
            <Tag
              item={item}
              key={item.id}
              selectedTags={selectedTags}
              handlePress={() => handleTagPress(item.id)}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={isDisabledButton}
            style={[
              styles.button,
              isDisabledButton && {backgroundColor: '#a6a6a6'},
            ]}
            onPress={closeModal}>
            <Text style={styles.continue}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MeditationExplainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: 650,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },

  tagsContainer: {
    flex: 3,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    height: 50,
    width: 250,
    borderRadius: 5,
    backgroundColor: '#3c71de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continue: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
});
