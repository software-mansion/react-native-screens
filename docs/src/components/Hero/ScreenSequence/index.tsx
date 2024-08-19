import React from 'react';
import styles from './styles.module.css';
import Sequence from '@site/src/components/Hero/ScreenSequence/Sequence';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const ScreenSequence = () => {
  return (
    <div className={styles.screens}>
      {ExecutionEnvironment.canUseViewport && <Sequence />}
    </div>
  );
};

export default ScreenSequence;
