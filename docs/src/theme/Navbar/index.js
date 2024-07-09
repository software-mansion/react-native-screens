import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Navbar } from '@swmansion/t-rex-ui';

export default function NavbarWrapper(props) {

  const heroImages = {
    logo: useBaseUrl('/img/logo.svg')
  }

  return (
    <Navbar heroImages={heroImages} useLandingLogoDualVariant={true} isAlgoliaActive={false} {...props} />
  );
}
