import React from 'react';
import styles from './styles.module.css';
import HomepageButton, {
  ButtonStyling,
  BorderStyling,
} from '@site/src/components/HomepageButton';

const LearnMore = () => {
  return (
    <div className={styles.learnMoreContainer}>
      <div className={styles.learnMoreContent}>
        <h4>React Native Screens is the first library migrated to Fabric!</h4>
        <p>Learn more about the new architecture in React Native Screens.</p>
      </div>
      <HomepageButton
        target="_blank"
        href="https://blog.swmansion.com/introducing-fabric-to-react-native-screens-fd17bf18858e"
        title="See blog post"
        backgroundStyling={ButtonStyling.TO_NAVY}
        borderStyling={BorderStyling.TRANSPARENT}
      />
    </div>
  );
};

export default LearnMore;
