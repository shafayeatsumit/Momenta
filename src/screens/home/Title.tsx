import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ScreenWidth, ScreenHeight } from '../../helpers/constants';
import { FontType } from '../../helpers/theme';

import _ from 'lodash';

interface Props {
  title: string;
  containerStyle?: any;
}



const Title: React.FC<Props> = ({ title, containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text allowFontScaling={false} style={styles.title}>{title}</Text>
    </View>

  );
};
export default Title;

const styles = StyleSheet.create({
  container: {
    height: ScreenHeight / 18,
    marginLeft: 25,
    width: ScreenWidth * .85,
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    fontFamily: FontType.Bold,
    fontSize: 30,
    color: 'white',
  }
});
