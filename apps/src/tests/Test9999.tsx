import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Outer />
    </View>
  );
}

function Outer() {
  return (
    <SafeAreaView edges={{ top: false }} style={{ backgroundColor: 'orange' }}>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="1"
          style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: 'red' }]}
          headerConfig={{ title: 'Outer', hidden: true }}>
          <Inner />
        </ScreenStackItem>
      </ScreenStack>
    </SafeAreaView>
  );
}

function Inner() {
  return (
    <SafeAreaView edges={{ top: false }} style={{ backgroundColor: 'blue' }}>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="2"
          contentStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'green',
          }}
          headerConfig={{ title: 'Inner', hidden: false }}
          style={StyleSheet.absoluteFill}>
          <Text>Inner Screen 2</Text>
        </ScreenStackItem>
      </ScreenStack>
    </SafeAreaView>
  );
}
