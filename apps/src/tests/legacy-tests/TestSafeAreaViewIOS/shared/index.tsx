import React from 'react';
import { Text } from 'react-native';
import BottomTabsSAVExample from '../bottom-tabs';
import StackV4SAVExample from '../stack-v4';
import RegularView from './RegularView';
import ScrollViewAutomatic from './ScrollViewAutomatic';
import ScrollViewNever from './ScrollViewNever';

export type ContentType =
  | 'regularView'
  | 'scrollViewNever'
  | 'scrollViewAutomatic'
  | 'tabs'
  | 'stack';

export function mapContentStringToComponent(content: ContentType) {
  switch (content) {
    case 'regularView':
      return <RegularView />;
    case 'scrollViewNever':
      return <ScrollViewNever />;
    case 'scrollViewAutomatic':
      return <ScrollViewAutomatic />;
    case 'tabs':
      return <BottomTabsSAVExample />;
    case 'stack':
      return <StackV4SAVExample />;
    default:
      return <Text>Unknown test case.</Text>;
  }
}
