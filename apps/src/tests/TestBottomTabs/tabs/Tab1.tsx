import React from 'react';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';

export function Tab1() {
  return (
    <CenteredLayoutView>
      <TabContentView selectNextTab={undefined} tabKey={'Tab1'} />
    </CenteredLayoutView>
  );
}
