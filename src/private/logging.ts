import { featureFlags } from 'react-native-screens';

let isDetailedLoggingEnabled = false;

export function bottomTabsDebugLog(
  ...args: Parameters<(typeof console)['log']>
) {
  if (isDetailedLoggingEnabled) {
    console.log(...args);
  }
}

export function internalEnableDetailedBottomTabsLogging() {
  isDetailedLoggingEnabled = true;
}

export const RNSLog = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.log(message, ...args);
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.warn(message, ...args);
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.error(message, ...args);
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.info(message, ...args);
    }
  },
};
