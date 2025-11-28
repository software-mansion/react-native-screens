import { device, element, by } from 'detox';
import { getIOSVersion } from '../../../scripts/e2e/ios-devices.js';
import semverSatisfies from 'semver/functions/satisfies';
import semverCoerce from 'semver/functions/coerce';

const backButtonElement = element(by.id('BackButton'));

export async function tapBarBackButton() {
  const platform = device.getPlatform();
  if (platform === 'ios') {
    return (await getIOSBackButton()).tap();
  } else if (platform === 'android') {
    return backButtonElement.tap();
  } else throw new Error(`Platform "${platform}" not supported`);
}
async function getIOSBackButton() {
  const iosVersion = semverCoerce(getIOSVersion().replace('iOS', ''))!;
  if (semverSatisfies(iosVersion, '>=26.0')) {
    const elementsByAttributes =
      (await backButtonElement.getAttributes()) as unknown as {
        elements: { className: string }[];
      };
    const elements = elementsByAttributes.elements;
    if (Array.isArray(elements)) {
      return backButtonElement.atIndex(
        elements.findIndex(elem => elem.className === '_UIButtonBarButton'),
      );
    }
  }
  return backButtonElement;
}
