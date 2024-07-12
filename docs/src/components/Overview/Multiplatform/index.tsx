import React from 'react';
import styles from './styles.module.css';
import VisionPro from '@site/src/components/Overview/Multiplatform/VisionPro';
import Phone from '@site/src/components/Overview/Multiplatform/Phone';
import Laptop from '@site/src/components/Overview/Multiplatform/Laptop';

const MultiplatformCarousel = () => {
  return (
    <div className={styles.multiplatformContainer}>
      <VisionPro className={styles.vision} />
      <Phone className={styles.phone} />
      <Laptop className={styles.laptop} />
    </div>
  );
};
export default MultiplatformCarousel;
