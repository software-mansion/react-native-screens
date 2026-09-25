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

/** Every iOS guard below derives from this, so none can leak onto Android. */
const isIOS = device.getPlatform() === 'ios';

export const describeIfIOS = isIOS ? describe : describe.skip;

export const describeIfAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

/**
 * Inferred from `RNS_APPLE_SIM_NAME` (Detox has no idiom query), e.g.
 * RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)". See scripts/e2e/ios-devices.js.
 */
const isIPadTarget =
  isIOS && /^iPad\s/i.test(process.env.RNS_APPLE_SIM_NAME ?? '');

export const describeIfIPad = isIPadTarget ? describe : describe.skip;

/** `true` on iOS at `version` or newer; `false` on Android. */
export function isIOSVersionAtLeast(version: string): boolean {
  return isIOS && isVersionEqualOrHigherThan(getIOSVersionNumber(), version);
}

/**
 * Suite guards for version-specific behavior. Each takes a MAJOR or
 * MAJOR.MINOR version and resolves to `describe` or `describe.skip`, so a new
 * iOS release needs no new export here.
 */

/** Suites for features added in iOS `version`; skipped on Android and older iOS. */
export const describeIfIOSAtLeast = (version: string) =>
  isIOSVersionAtLeast(version) ? describe : describe.skip;

/**
 * Suites for behavior that iOS `version` changed, kept on the releases before
 * it; skipped on Android and from `version` on. `isIOS` is required on its own
 * because `isIOSVersionAtLeast` is also `false` on Android, so negating that
 * alone would run the suite there.
 */
export const describeIfIOSBelow = (version: string) =>
  isIOS && !isIOSVersionAtLeast(version) ? describe : describe.skip;

/** Suites for iPad-only features added in iPadOS `version`. */
export const describeIfIPadOSAtLeast = (version: string) =>
  isIPadTarget && isIOSVersionAtLeast(version) ? describe : describe.skip;
