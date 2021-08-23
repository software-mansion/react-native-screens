import React from 'react';
import 'react-native/tvos-types.d';
import {View, Text, Button} from 'react-native';
import {EXAMPLES} from './examples';
import {STYLES} from './styles';

export default function HomeScreen({navigation}) {
  return (
    <View style={STYLES.screenContainer}>
      <Text>
        This is the example app created for testing React Native Screens on 📺
      </Text>
      <Text>Examples:</Text>
      {EXAMPLES.map(name => (
        <Button
          key={name}
          title={name}
          onPress={() => navigation.navigate(name)}
        />
      ))}
    </View>
  );
}
