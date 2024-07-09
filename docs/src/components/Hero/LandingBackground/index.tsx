import React from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import HeroScreens from '@site/src/components/Hero/Screens'
import styles from "./styles.module.css";

const LandingBackground = () => {
  return (
    <>
    <div className={styles.heroBackground}/>
      {ExecutionEnvironment.canUseViewport && <HeroScreens />}
    </>
  );
};

export default LandingBackground;
