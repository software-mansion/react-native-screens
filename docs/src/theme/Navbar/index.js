import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Navbar } from 'test-rex';

export default function NavbarWrapper(props) {

  return (
    <Navbar useLandingLogoDualVariant={true} isAlgoliaActive={false} {...props} />
  );
}
