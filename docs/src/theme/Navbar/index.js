import React from 'react';
import { Navbar } from '@swmansion/t-rex-ui';
import TopPromoRotator from '@site/src/components/TopPromoRotator';

export default function NavbarWrapper(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <TopPromoRotator />
      <Navbar
        useLandingLogoDualVariant={true}
        isAlgoliaActive={false}
        {...props}
      />
    </div>
  );
}
