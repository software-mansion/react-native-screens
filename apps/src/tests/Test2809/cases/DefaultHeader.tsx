import * as React from 'react';
import { Button, View } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { FinalScreen } from './Shared';

const Stack = createNativeStackNavigator();

export default function DefaultHeader() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="LongLongLongLongLong" component={First} />
        <Stack.Screen name="Second" component={FinalScreen} />
      </Stack.Navigator>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Button
        title="Open screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}
