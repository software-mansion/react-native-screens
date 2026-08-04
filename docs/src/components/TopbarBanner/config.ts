import type { BannerZone } from './TopbarBannerClient';

export const TOPBAR_BANNER = {
  rotateIntervalMs: 4000,
  hiddenPaths: [
    '/react-native-screens/docs',
  ] as string[],
  zones: [
    {
      zoneId: 'react-native-screens-topbar-1',
      contentId: 'ea15c4216158c4097b65fe6504a4b3b7',
      fallbackBgColor: '#001a72',
    },
    {
      zoneId: 'react-native-screens-topbar-2',
      contentId: 'ea15c4216158c4097b65fe6504a4b3b7',
      fallbackBgColor: '#001a72',
    },
    {
      zoneId: 'react-native-screens-topbar-3',
      contentId: 'ea15c4216158c4097b65fe6504a4b3b7',
      fallbackBgColor: '#001a72',
    },
  ] satisfies BannerZone[],
};
