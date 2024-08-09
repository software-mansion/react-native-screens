import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import MultiplatformCarousel from '@site/src/components/Overview/Multiplatform';

interface OverviewProps {
  title: string;
  content: string;
  src?: string;
  reversed?: boolean;
  multiplatform?: boolean;
}

const OverviewTile = ({
  title,
  content,
  src,
  reversed = false,
  multiplatform = false,
}: OverviewProps) => {
  return (
    <div className={clsx(styles.overviewTile, reversed && styles.tileReversed)}>
      <div className={styles.contentContainer}>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      <div className={styles.imageContainer}>
        {!multiplatform ? <img src={src} /> : <MultiplatformCarousel />}
      </div>
    </div>
  );
};

export default OverviewTile;
