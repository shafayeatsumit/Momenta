import React from "react";
import { View, StyleSheet } from "react-native";
interface MyProps { }

export default function CenterContainer(props: React.PropsWithChildren<MyProps>) {
  return <View style={styles.container}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  }
});
