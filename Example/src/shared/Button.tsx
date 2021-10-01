import React from 'react';
import { Button as RNButton } from 'react-native';
import { Spacer } from './Spacer';

interface Props {
  title: string;
  onPress: () => void;
  testID?: string;
}

export const Button = ({ title, onPress, testID }: Props): JSX.Element => (
  <Spacer>
    <RNButton title={title} onPress={onPress} testID={testID} />
  </Spacer>
);
