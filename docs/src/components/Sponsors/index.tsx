import React from 'react';
import styles from './styles.module.css';

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import usePageType from '@site/src/hooks/usePageType';

const Sponsors = () => {
  const sponsorsLogos = {
    expo: {
      light: useBaseUrl('img/expo.svg'),
      dark: useBaseUrl('img/expo-dark.svg'),
    },
    shopify: {
      light: useBaseUrl('img/shopify.svg'),
      dark: useBaseUrl('img/shopify-dark.svg'),
    },
  };

  return (
    <div>
      <h2 className={styles.sponsorsTitle}>Sponsors</h2>
      <div className={styles.sponsorsBrand}>
        <ThemedImage sources={sponsorsLogos.expo} className={styles.sponsor} />
        <ThemedImage
          sources={sponsorsLogos.shopify}
          className={styles.sponsor}
        />
      </div>
    </div>
  );
};

export default Sponsors;
