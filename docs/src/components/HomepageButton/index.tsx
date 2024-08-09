import React from 'react';
import styles from './styles.module.css';

import ArrowRight from '@site/static/img/arrow-right-hero.svg';
import clsx from 'clsx';

export const ButtonStyling = {
  TO_NAVY: styles.buttonTransparentStyling,
  TO_TRANSPARENT: styles.buttonNavyStyling,
};

export const BorderStyling = {
  NAVY: styles.buttonNavyBorderStyling,
  TRANSPARENT: styles.buttonTransparentBorderStyling,
};

const HomepageButton: React.FC<{
  title: string;
  href: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
  backgroundStyling?: string;
  borderStyling?: string;
  enlarged?: boolean;
}> = ({
  title,
  href,
  target = '_self',
  backgroundStyling = ButtonStyling.TO_TRANSPARENT,
  borderStyling = BorderStyling.NAVY,
}) => {
  return (
    <a href={href} target={target} className={styles.homepageButtonLink}>
      <div
        className={clsx(
          styles.homepageButton,
          backgroundStyling,
          borderStyling
        )}>
        {title}

        <div className={styles.arrow}>
          <ArrowRight />
        </div>
      </div>
    </a>
  );
};

export default HomepageButton;
