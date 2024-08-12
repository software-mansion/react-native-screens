import React from 'react';
import { Navbar } from '@swmansion/t-rex-ui';

export default function NavbarWrapper(props) {
  return (
    <Navbar
      useLandingLogoDualVariant={true}
      isAlgoliaActive={false}
      {...props}
    />
  );
}
