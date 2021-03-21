import React, { useCallback } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { triggerHaptic } from "../../helpers/hapticFeedback";
import { eventButtonPush } from "../../helpers/analytics";

interface Props {
  onSelect: Function;
  initialIndex: number;
  listItems: string[] | number[];
  itemWidth: number;
  itemHeight: number;
  isVertical?: boolean;
  fontSize: number;
}



const ScrollPicker: React.FC<Props> = ({ onSelect, itemHeight, fontSize, initialIndex, itemWidth, listItems, isVertical = false }: Props) => {

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    console.log('time picked', event.nativeEvent.contentOffset.x)
  }


  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    triggerHaptic();
  }, []);

  const _viewabilityConfig = {
    minimumViewTime: 150,
    itemVisiblePercentThreshold: 10
  }



  return (
    <Animated.View style={[styles.main, { width: itemWidth * 5 },
    isVertical && { transform: [{ rotate: '90deg' }] }
    ]}>
      <Animated.FlatList
        data={listItems}
        horizontal
        pagingEnabled={true}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewabilityConfig}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={itemWidth}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) =>
          ({ length: itemWidth, offset: itemWidth * index, index })
        }
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: itemWidth * 2,
          paddingRight: itemWidth * 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )
        }
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * itemWidth,
            (index - 1) * itemWidth,
            (index) * itemWidth,
            (index + 1) * itemWidth,
            (index + 2) * itemWidth,
          ]

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 0.4, 1, 0.4, 0.3]
          })

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 0.7, 1, 0.7, 0.4]
          })

          return (
            <View style={[styles.textContainer, { width: itemWidth, height: itemHeight, },
            isVertical && { transform: [{ rotate: '270deg' }] }]}>
              <Animated.Text style={[styles.text,
              { opacity, transform: [{ scale }], fontSize },
              Number.isInteger(item) && item >= 10 && { fontSize: 30 }
              ]}>{item}</Animated.Text>
            </View>
          );
        }}
      />
    </Animated.View>

  );
}
const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flex: 1,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },

});
export default ScrollPicker;

