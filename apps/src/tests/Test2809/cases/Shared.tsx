import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';


export function FinalScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
      <Text>VOID</Text>
      <Button title="Pop to top" onPress={() => navigation.popTo('Home')} />
    </View>
  );
}
