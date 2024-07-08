import React from "react";
import styles from "./styles.module.css";
import HomepageButton, { ButtonStyling, BorderStyling } from "@site/src/components/HomepageButton";

const LearnMore = () => {
  return (
    <section>
      <div className={styles.learnMoreContainer}>
        <div className={styles.learnMoreContent}>
          <h4 >Did you know that this library is the first library migrated to Fabric?</h4>
          <p>Learn more about the new architecture in React Native Screens.</p>
          
        </div>
        <HomepageButton
          target="_blank"
          href="https://swmansion.com/"
          title="See blog post"
          backgroundStyling={ButtonStyling.TO_PURPLE}
          borderStyling={BorderStyling.TRANSPARENT}
        />
      </div>
    </section>
  );
};

export default LearnMore;
