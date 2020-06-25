import * as React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Svg, Rect, G, Text as SvgText, TSpan} from 'react-native-svg';

let persianText =
  'In this section, we will learn how to make the Clock component truly reusable and encapsulated. It will set up its own timer and update itself every second.';

const {width, height} = Dimensions.get('window');

export default () => (
  <Svg width="100%" height="100%">
    <SvgText
      x={0}
      y={20}
      fontSize={30}
      strokeWidth={1}
      strokeDashoffset={1}
      strokeDasharray={4}
      stroke={'blue'}
      fill={'black'}>
      <TSpan inlineSize="100%">
        Testing word-wrap... Testing word-wrap... Testing word-wrap... Testing
        word-wrap...
      </TSpan>
      <TSpan inlineSize="100%">
        Testing word-wrap... Testing word-wrap... Testing word-wrap... Testing
        word-wrap...
      </TSpan>
    </SvgText>
  </Svg>
);
