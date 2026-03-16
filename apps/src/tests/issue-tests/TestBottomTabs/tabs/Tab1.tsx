import React from 'react';
import { CenteredLayoutView } from '../../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../../shared/styling/Colors';

export function Tab1() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.OffWhite }}>
      <TabContentView selectNextTab={undefined} screenKey={'Tab1'} />
    </CenteredLayoutView>
  );
}
