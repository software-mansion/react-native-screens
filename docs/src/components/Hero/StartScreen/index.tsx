import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import HomepageButton from '@site/src/components/HomepageButton';

const StartScreen = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.headingLabel}>
            <span>React Native</span>
            <span>Screens</span>
          </h1>
          <h2 className={styles.subheadingLabel}>
            Native Navigation primitives for your React Native app.
          </h2>
        </div>
        <div className={styles.buttonContainer}>
          <HomepageButton
            target="_blank"
            href="https://reactnavigation.org/docs/7.x/native-stack-navigator/"
            title="Learn more"
          />
        </div>
      </div>
    </section>
  );
};

export default StartScreen;
