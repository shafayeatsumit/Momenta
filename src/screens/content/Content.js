import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
const {width, height} = Dimensions.get('window');
const {
  cond,
  eq,
  add,
  call,
  set,
  Value,
  event,
  lessOrEq,
  and,
  greaterOrEq,
} = Animated;

// console.log(`width ${width} height ${height}`);
// 40% of the height - circle height
// 60% of the width - circle height
const maxYLimit = height * 0.4 - 60;
const maxXLimit = width * 0.6 - 60;
console.log('max y limit', maxYLimit);
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.offsetX = new Value(0);
    this.offsetY = new Value(0);
    this.absoluteX = this.offsetX;
    this.absoluteY = this.offsetY;
    this.gestureState = new Value(-1);
    this.opacity = new Value(1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          translationY: this.dragY,
          state: this.gestureState,
        },
      },
    ]);

    this.setYOffset = cond(
      lessOrEq(add(this.absoluteY, this.dragY), 0),
      set(this.offsetY, 0),
      set(this.offsetY, maxYLimit),
    );

    this.setXOffset = cond(
      lessOrEq(add(this.absoluteX, this.dragX), 0),
      set(this.offsetX, 0),
      set(this.offsetX, maxXLimit),
    );

    this.addY = cond(
      and(
        greaterOrEq(add(this.absoluteY, this.dragY), 0),
        lessOrEq(add(this.absoluteY, this.dragY), maxYLimit),
      ),
      add(this.offsetY, this.dragY),
      this.setYOffset,
    );

    this.addX = cond(
      and(
        greaterOrEq(add(this.absoluteX, this.dragX), 0),
        lessOrEq(add(this.absoluteX, this.dragX), maxXLimit),
      ),
      add(this.offsetX, this.dragX),
      this.setXOffset,
    );

    this.opacity = cond(eq(this.gestureState, State.ACTIVE), 0.3, 1);

    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      this.addX,
      set(this.offsetX, this.addX),
    );

    this.transY = cond(eq(this.gestureState, State.ACTIVE), this.addY, [
      set(this.offsetY, this.addY),
    ]);
  }

  onDrop = ([x, y]) => {
    console.log(`You dropped at x: ${x} and y: ${y}`);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graph}>
          <Animated.Code>
            {() =>
              cond(
                eq(this.gestureState, State.END),
                call([this.addX, this.addY], this.onDrop),
              )
            }
          </Animated.Code>

          <PanGestureHandler
            maxPointers={1}
            onGestureEvent={this.onGestureEvent}
            onHandlerStateChange={this.onGestureEvent}>
            <Animated.View
              style={[
                styles.box,
                {
                  transform: [
                    {
                      translateX: this.transX,
                    },
                    {
                      translateY: this.transY,
                    },
                  ],
                },
              ]}
            />
          </PanGestureHandler>
        </View>
      </View>
    );
  }
}

const CIRCLE_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graph: {
    backgroundColor: '#141831',
    height: ScreenHeight * 0.4,
    width: ScreenWidth * 0.6,
  },
  box: {
    borderWidth: 2,
    borderColor: '#3c71de',
    // backgroundColor: '#3c71de',
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
