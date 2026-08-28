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
  minimumVersion: MajorVersion | MajorMinorVersion,
) {
  const [majorA, minorA = '0'] = version.split('.').map(Number);
  const [majorB, minorB = '0'] = minimumVersion.split('.').map(Number);
  if (majorA !== majorB) {
    return majorA - majorB;
  } else {
    return Number(minorA) - Number(minorB);
  }
}

/** `true` when `version` is at least `minimumVersion`. */
export default function isVersionEqualOrHigherThan(
  version: string,
  minimumVersion: string,
) {
  assertSupportedVersionString(version);
  assertSupportedVersionString(minimumVersion);

  return compareVersions(version, minimumVersion) >= 0;
}
