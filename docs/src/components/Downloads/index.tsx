import React from 'react';
import styles from './styles.module.css';

const Downloads = () => {
  return (
    <div className={styles.downloadsWrapper}>
      <div className={styles.downloadsContainer}>
        <h2 className={styles.title}>+1 000 000 / week</h2>
        <p className={styles.content}>
          React Native Screens is directly used in the React Navigation and Expo
          Router libraries, some of the most popular libraries in the React
          Native ecosystem. That's why nearly every second project uses React
          Native Screens in React Native applications.
        </p>
        <div className={styles.brandContainer}>
          <img src="img/react-navigation.svg" />
          <img src="img/expo-router.svg" />
        </div>
      </div>
    </div>
  );
};

export default Downloads;
