import * as React from 'react';
import { type ViewProps } from 'react-native';
import ScreenContentWrapper from './ScreenContentWrapper';

export default function DebugContainer(props: ViewProps) {
  return <ScreenContentWrapper {...props} />;
}
