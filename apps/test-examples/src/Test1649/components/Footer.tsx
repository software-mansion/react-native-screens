import * as React from 'react';
import {
  Button,
  View,
  Text,
} from 'react-native';
import * as jotai from 'jotai';
import { isAdditionalContentVisibleAtom } from '../state';

export default function Footer() {
  const setAdditionalContentVisible = jotai.useSetAtom(
    isAdditionalContentVisibleAtom,
  );

  return (
    <View
      style={{
        backgroundColor: 'goldenrod',
        padding: 20,
        borderColor: 'darkblue',
        borderWidth: 1,
      }}>
      <Text>SomeContent</Text>
      <Button
        title="Click me"
        onPress={() => {
          setAdditionalContentVisible(old => !old);
        }}
      />
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
    </View>
  );
}
