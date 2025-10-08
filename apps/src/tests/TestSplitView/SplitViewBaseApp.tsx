import React from 'react';
import {
  SplitViewHost,
  SplitViewScreen,
} from 'react-native-screens/experimental';
import { TestScreenStack } from '..';
import { SplitViewBaseConfig } from './helpers/types';
import { CommentColumn } from '../TestScreenStack/components/CommentColumn';
import { DocumentHistory } from '../TestScreenStack/components/DocumentHistory';

const SplitViewBaseApp = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitViewBaseConfig;
}) => {
  return (
    <SplitViewHost {...splitViewBaseConfig}>
      <SplitViewScreen.Column>
        <DocumentHistory />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <CommentColumn />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <TestScreenStack />
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
};

export default SplitViewBaseApp;
