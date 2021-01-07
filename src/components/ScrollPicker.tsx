import React from 'react'
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
const { width, height } = Dimensions.get('window');

interface Props {
  onSelect: Function;
  initialValue: number;
}

const timers = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i + 1));
const ITEM_SIZE = 40;

const ScrollPicker: React.FC<Props> = ({ onSelect, initialValue }: Props) => {

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentIndex = event.nativeEvent.contentOffset.x / ITEM_SIZE;
    const timePicked = currentIndex + 1;
    onSelect(timePicked);
  }

  return (


    <Animated.View style={styles.main}>
      <Animated.FlatList
        data={timers}
        horizontal
        style={styles.flatListStyle}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={ITEM_SIZE}
        initialScrollIndex={initialValue - 1}
        getItemLayout={(data, index) =>
          ({ length: ITEM_SIZE, offset: ITEM_SIZE * index, index })
        }
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: ITEM_SIZE * 2,
          paddingRight: ITEM_SIZE * 2,
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
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            (index) * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
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
            <View style={styles.textContainer}>
              <Animated.Text style={[styles.text,
              { opacity, transform: [{ scale }] }
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
    bottom: 30,
    width: 200,
    alignSelf: 'center',
    flex: 1,
  },
  flatListStyle: {
    // flexGrow: 0,
  },
  text: {
    fontSize: 35,
    color: '#ffffff',
    fontWeight: '600',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    // backgroundColor: 'red',
    // borderWidth: 1,
    // marginHorizontal: 1,
  },

});
export default ScrollPicker;