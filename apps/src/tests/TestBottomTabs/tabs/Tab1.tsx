import React from 'react';
import { LayoutView } from '../components/LayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab1() {
  return (
    <LayoutView style={{ backgroundColor: Colors.OffWhite }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab1'} />
    </LayoutView>
  );
}
