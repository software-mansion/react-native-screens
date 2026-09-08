import React from 'react';
import { getInitColorSchemeScript } from '@mui/material/styles';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { useLocation } from '@docusaurus/router';
import theme from '@site/src/theme/muiTheme';
import { TopbarBanner, isBannerHidden } from '@site/src/components/TopbarBanner';
import { TOPBAR_BANNER } from '@site/src/components/TopbarBanner/config';

export default function Root({ children }) {
  const { pathname } = useLocation();
  const bannerHidden = isBannerHidden(pathname, TOPBAR_BANNER.hiddenPaths);

  return (
    <>
      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>
        {!bannerHidden && (
          <TopbarBanner
            zones={TOPBAR_BANNER.zones}
            rotateIntervalMs={TOPBAR_BANNER.rotateIntervalMs}
          />
        )}
        {children}
      </CssVarsProvider>
    </>
  );
}
