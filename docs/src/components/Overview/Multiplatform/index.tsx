import React from 'react';
import styles from './styles.module.css';
import VR from '@site/static/img/vr.svg';
import TV from '@site/static/img/TV.svg';
import Phone from '@site/static/img/phone.svg';
import Laptop from '@site/static/img/laptop.svg';

const MultiplatformCarousel = () => {
  return (
    <div className={styles.multiplatformContainer}>
      <div className={styles.animation}>
        <div className={styles.marquee}>
          <ul className={styles.content}>
            <div className={styles.marqueeItem}>
              <VR />
            </div>
            <div className={styles.marqueeItem}>
              <Phone />
            </div>
            <div className={styles.marqueeItem}>
              <Laptop />
            </div>
            <div className={styles.marqueeItem}>
              <TV />
            </div>
          </ul>

          <ul aria-hidden="true" className={styles.content}>
            <div className={styles.marqueeItem}>
              <VR />
            </div>
            <div className={styles.marqueeItem}>
              <Phone />
            </div>
            <div className={styles.marqueeItem}>
              <Laptop />
            </div>
            <div className={styles.marqueeItem}>
              <TV />
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiplatformCarousel;
