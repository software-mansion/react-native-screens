import { device, element, by } from 'detox';
import {
  ElementAttributes,
  getMatches,
  isIOSVersionAtLeast,
} from '../e2e-utils';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '../native-class-names';

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
  if (isIOSVersionAtLeast('26.0')) {
    // Detox reports the native class name on iOS but does not type it.
    const matches = (await getMatches(by.id('BackButton'))) as Array<
      ElementAttributes & { className?: string }
    >;
    const uiBarButtonIndex = matches.findIndex(
      match => match.className === CLASS_NAME_UI_BUTTON_BAR_BUTTON,
    );
    if (uiBarButtonIndex !== -1) {
      return backButtonElement.atIndex(uiBarButtonIndex);
    }
  }
  return backButtonElement;
}
