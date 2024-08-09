import React from 'react';
import OverviewTile from '@site/src/components/Overview/OverviewTile';
import styles from './styles.module.css';

const TILES = [
  {
    title: 'Truly native',
    content:
      'This navigator uses the native APIs and "Fragment" on Android so that navigation will behave exactly the same and have the same performance characteristics as apps built natively on top of those APIs.',
    src: 'img/overview-native.png',
  },
  {
    title: 'Customisable',
    content:
      'You can freely change the appearance of the defined paths. Choosing the orientation, animation of the transit, or even the type of presentation - you are one property away from changing what you want.',
    src: 'img/overview-customisable.png',
    reversed: true,
  },
  {
    title: 'Multiplatform',
    content:
      'Forget about being limited to the chosen platform. With React Native Screens, you can freely navigate between screens on iOS, Android, Web, tvOS, Windows or Vision Pro.',
    multiplatform: true,
  },
];

const Overview = () => {
  return (
    <div className={styles.overviewContainer}>
      <h1 className={styles.title}>What does it do?</h1>
      {TILES.map(tile => (
        <OverviewTile
          title={tile.title}
          content={tile.content}
          src={tile.src}
          reversed={!!tile.reversed}
          multiplatform={tile.multiplatform}
        />
      ))}
    </div>
  );
};

export default Overview;
