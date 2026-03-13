import React from 'react';
import type { Scenario } from '../../shared/helpers';
import { Text, View } from 'react-native';

const SCENARIO: Scenario = {
  name: 'Test simple navigation',
  key: 'test-tabs-simple-nav',
  details: 'Test basic navigation scenarios',
  platforms: ['android', 'ios'],
  AppComponent: App,
};

export default SCENARIO;

export function App() {
  return (
    <View>
      <Text>Hello world</Text>
    </View>
  );
}
