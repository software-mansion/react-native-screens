import { device, element, by } from 'detox';
import isVersionEqualOrHigherThan from '../helpers/isVersionEqualOrHigherThan';

const { getIOSVersionNumber } = require('../../../scripts/e2e/ios-devices.js');

const IOS_BAR_BUTTON_TYPE = '_UIButtonBarButton';
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
  const iosVersion = getIOSVersionNumber();
  if (isVersionEqualOrHigherThan(iosVersion, '26.0')) {
    const elementsByAttributes =
      (await backButtonElement.getAttributes()) as unknown as {
        elements: { className: string }[];
      };
    const elements = elementsByAttributes.elements;
    if (Array.isArray(elements)) {
      const uiBarButtonIndex = elements.findIndex(
        elem => elem.className === IOS_BAR_BUTTON_TYPE,
      );
      if (uiBarButtonIndex !== -1) {
        return backButtonElement.atIndex(uiBarButtonIndex);
      }
    }
  }
  return backButtonElement;
}
