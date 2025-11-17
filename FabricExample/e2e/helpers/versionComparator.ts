function assertSupportedVersionString(version: string): asserts version is MajorVersion | MajorMinorVersion {
    if (Number(version) === parseInt(version, 10)) {
        return;
    }
    const parts = version.split('.');
    if (parts.length === 2) {
        const [major, minor] = parts;
        if (Number(major) === parseInt(major, 10) && Number(minor) === parseInt(minor, 10)) {
            return;
        }
    }
    throw new Error(`Version string "${version}" is not a valid MAJOR or MAJOR.MINOR version.`);
}

export function isVersion(version: string) {
    assertSupportedVersionString(version);
    return {
        equalOrHigherThan(versionToCompare: string) {
            assertSupportedVersionString(versionToCompare);
            return compareVersions(version, versionToCompare) >= 0;
        },
    }
}

function compareVersions(version: MajorVersion | MajorMinorVersion, versionToCompare: MajorVersion | MajorMinorVersion) {
    const [majorA, minorA = '0'] = version.split('.').map(Number);
    const [majorB, minorB = '0'] = versionToCompare.split('.').map(Number);
    if (majorA !== majorB) {
        return majorA - majorB;
    } else {
        return Number(minorA) - Number(minorB);
    }
}

type MajorVersion = `${number}`;
type MajorMinorVersion = `${number}.${number}`;
