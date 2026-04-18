import React from 'react';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import { Colors } from '@apps/shared/styling';

export function Tab1() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.OffWhite }}>
      <TabContentView selectNextTab={undefined} screenKey={'Tab1'} />
    </CenteredLayoutView>
  );
}
