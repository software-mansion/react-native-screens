import React from 'react';
import { LayoutView } from '../components/LayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab3() {
  // const
  return (
    <LayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab3'} />
    </LayoutView>
  );
}
