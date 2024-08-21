import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ScreenSequence from '@site/src/components/Hero/ScreenSequence';
import styles from './styles.module.css';

const LandingBackground = () => {
  return (
    <>
      <div className={styles.heroBackground} />
      {ExecutionEnvironment.canUseViewport && <ScreenSequence />}
    </>
  );
};

export default LandingBackground;
