import React from 'react';
import { LayoutView } from '../components/LayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab3() {
  return (
    <LayoutView style={{ backgroundColor: Colors.YellowDark120 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab3'} />
    </LayoutView>
  );
}
