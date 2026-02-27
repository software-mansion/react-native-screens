import React from 'react';
import { CenteredLayoutView } from '../../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';

export function Tab2() {
  return (
    <CenteredLayoutView style={{ backgroundColor: 'white' }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab2'} />
    </CenteredLayoutView>
  );
}
