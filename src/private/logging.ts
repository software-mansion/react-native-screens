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
