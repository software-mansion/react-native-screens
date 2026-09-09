import { device } from 'detox';

/** Typed once here; specs never `require` `scripts/e2e/*` directly. */
const { getIOSVersionNumber } =
  require('../../../../scripts/e2e/ios-devices.js') as {
    getIOSVersionNumber: () => string;
  };

type MajorVersion = `${number}`;
type MajorMinorVersion = `${number}.${number}`;

function assertSupportedVersionString(
  version: string,
): asserts version is MajorVersion | MajorMinorVersion {
  if (Number(version) === parseInt(version, 10)) {
    return;
  }
  const parts = version.split('.');
  if (parts.length === 2) {
    const [major, minor] = parts;
    if (
      Number(major) === parseInt(major, 10) &&
      Number(minor) === parseInt(minor, 10)
    ) {
      return;
    }
  }
  throw new Error(
    `Version string "${version}" is not a valid MAJOR or MAJOR.MINOR version.`,
  );
}

function compareVersions(
  version: MajorVersion | MajorMinorVersion,
  versionToCompare: MajorVersion | MajorMinorVersion,
) {
  const [majorA, minorA = '0'] = version.split('.').map(Number);
  const [majorB, minorB = '0'] = versionToCompare.split('.').map(Number);
  if (majorA !== majorB) {
    return majorA - majorB;
  } else {
    return Number(minorA) - Number(minorB);
  }
}

/** `true` when `version` is at least `minimumVersion`. */
function isVersionEqualOrHigherThan(version: string, minimumVersion: string) {
  assertSupportedVersionString(version);
  assertSupportedVersionString(minimumVersion);

  return compareVersions(version, minimumVersion) >= 0;
}

export const describeIfiOS =
  device.getPlatform() === 'ios' ? describe : describe.skip;

export const describeIfAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

/**
 * Inferred from `RNS_APPLE_SIM_NAME` (Detox has no idiom query), e.g.
 * RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)". See scripts/e2e/ios-devices.js.
 */
const isIPadTarget =
  device.getPlatform() === 'ios' &&
  /^iPad\s/i.test(process.env.RNS_APPLE_SIM_NAME ?? '');

export const describeIfiPad = isIPadTarget ? describe : describe.skip;

/** `true` on iOS at `version` or newer; `false` on Android. */
export function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

/** Suites for iOS 26+ only features; skipped on Android and older iOS. */
export const describeIfiOS26 = isIOSVersionAtLeast('26.0')
  ? describe
  : describe.skip;

export const describeIfiPadOS26 =
  isIPadTarget && isIOSVersionAtLeast('26.0') ? describe : describe.skip;
