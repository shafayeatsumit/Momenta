import React from 'react'
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Exercise } from "../../redux/actions/exercise";
import { RouteProp } from '@react-navigation/native';


interface Props {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const GuidedExercise: React.FC<Props> = ({ navigation, route }: Props) => {
  console.log('route params', route.params.exercise);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: 'white' }}> Guided Exercise </Text>
    </View>
  );
}

export default GuidedExercise;