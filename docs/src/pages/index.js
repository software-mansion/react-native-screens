import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LandingBackground from '@site/src/components/Hero/LandingBackground';
import HomepageStartScreen from '@site/src/components/Hero/StartScreen'
import LearnMore from '@site/src/components/LearnMore'
import HireUsSection from '@site/src/components/HireUsSection'
import styles from './styles.module.css'


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`React Native Screens`}
      description="Native Navigation primitives for your React Native app.">
    <LandingBackground/>
    <div className={styles.container}>
      <HomepageStartScreen/>
      <LearnMore/>
      <HireUsSection/>
    </div>
    </Layout>
  );
}
