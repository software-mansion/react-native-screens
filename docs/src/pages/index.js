import React from 'react';
import Layout from '@theme/Layout';
import LandingBackground from '@site/src/components/Hero/LandingBackground';
import FooterBackground from '@site/src/components/FooterBackground';
import HomepageStartScreen from '@site/src/components/Hero/StartScreen';
import Downloads from '@site/src/components/Downloads';
import Overview from '@site/src/components/Overview';
import LearnMore from '@site/src/components/LearnMore';
import Testimonals from '@site/src/components/Testimonials';
import Sponsors from '@site/src/components/Sponsors';
import { HireUsSection } from '@swmansion/t-rex-ui';
import styles from './styles.module.css';

export default function Home() {
  return (
    <Layout description="Native Navigation primitives for your React Native app.">
      <div>
        <LandingBackground />
      </div>
      <div className={styles.container}>
        <HomepageStartScreen />
      </div>
      <Downloads />
      <div className={styles.container}>
        <Overview />
        <LearnMore />
      </div>
      <Testimonals />
      <div className={styles.container}>
        <Sponsors />
        <HireUsSection
          href={
            'https://swmansion.com/contact/projects?utm_source=screens&utm_medium=docs '
          }
        />
      </div>
      <FooterBackground />
    </Layout>
  );
}
