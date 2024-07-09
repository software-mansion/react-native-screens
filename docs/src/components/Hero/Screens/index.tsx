import React from 'react';
import styles from './styles.module.css';
import Screens from '@site/src/components/Hero/Screens/Icon';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const HeroScreens = () => {
  return (
    <div className={styles.screens}>
      {ExecutionEnvironment.canUseViewport && <Screens/>}
    </div>
  );
};

export default HeroScreens;
