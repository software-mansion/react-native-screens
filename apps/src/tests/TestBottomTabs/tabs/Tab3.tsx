import React from 'react';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab3() {
  // const
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab3'} />
    </CenteredLayoutView>
  );
}
