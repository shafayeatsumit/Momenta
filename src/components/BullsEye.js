import React from 'react';
import Svg, {Circle, G} from 'react-native-svg';
import {StyleSheet, View} from 'react-native';
import {ScreenWidth} from '../helpers/constants/common';
function Icon() {
  return (
    <View style={styles.main}>
      <Svg width="204" height="204" viewBox="0 0 204 204">
        <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
          <G fill="#3C71DE" transform="translate(-85 -565)">
            <G transform="translate(85 565)">
              <Circle cx="102" cy="102" r="102" opacity="0.08" />
              <Circle cx="102" cy="102" r="69" opacity="0.159" />
              <Circle cx="103.5" cy="103.5" r="33.5" />
            </G>
          </G>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: 205,
    width: ScreenWidth,
    position: 'absolute',
    bottom: -103,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Icon;
