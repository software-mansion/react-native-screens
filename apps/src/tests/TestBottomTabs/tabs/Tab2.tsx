import React from 'react';
import { LayoutView } from '../components/LayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab2() {
  return (
    <LayoutView style={{ backgroundColor: Colors.PurpleLight100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab2'} />
    </LayoutView>
  );
}
