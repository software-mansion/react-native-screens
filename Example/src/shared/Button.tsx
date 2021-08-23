import React from 'react';
import { Button as RNButton } from 'react-native';
import { Spacer } from './Spacer';

interface Props {
  title: string;
  onPress: () => void;
}

export const Button = ({ title, onPress }: Props): JSX.Element => (
  <Spacer>
    <RNButton title={title} onPress={onPress} />
  </Spacer>
);
