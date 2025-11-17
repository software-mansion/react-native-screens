import { device, element, by } from 'detox';
import { getiosVersion } from '../../../scripts/devices.js';
import semverSatisfies from 'semver/functions/satisfies';
import semverCoerce from 'semver/functions/coerce';

export async function getBackButton() {
    const platform = device.getPlatform();
    if (platform === 'ios') {
        return getiOSBackButton();
    } else if (platform === 'android') {
        throw new Error('Not implemented yet');
    } else throw new Error(`Platform "${platform}" not supported`);
}
async function getiOSBackButton() {
    const iosVersion = semverCoerce(getiosVersion())!;
    const backButtonElement = element(by.id('BackButton'));
    console.log('here1');
    if (semverSatisfies(iosVersion, '>=26.0')) {
        console.log('here2');
        const elementsByAttributes = await backButtonElement.getAttributes() as unknown as { elements: { className: string }[] };
        const elements = elementsByAttributes.elements;
        if (Array.isArray(elements)) {
            console.log('here3');
            return backButtonElement.atIndex(elements.findIndex(
                elem => elem.className === '_UIButtonBarButton'
            ));
        } else return backButtonElement;
    } else {
        return backButtonElement;
    }
}
