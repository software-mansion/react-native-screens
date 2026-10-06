import { Image } from 'react-native';
import { parseAndroidIconToNativeProps } from '../components/shared';
import { resolveIconAssetSources } from '../components/stack/header/ios/iconUtils.ios';
import { prepareHeaderBarButtonItems } from '../legacy/components/helpers/prepareHeaderBarButtonItems';
import type { PlatformIconIOS } from '../components/shared/types';

const source = { uri: 'file:///tmp/icon.png', width: 24, height: 24, scale: 2 };

beforeEach(() => {
  jest.spyOn(Image, 'resolveAssetSource').mockReturnValue(source);
});

afterEach(() => jest.restoreAllMocks());

it.each([undefined, 'automatic', 'synchronous'] as const)(
  'preserves %s through both iOS header paths and Android',
  preferredLoadingMode => {
    const original = {
      type: 'imageSource' as const,
      imageSource: source,
      preferredLoadingMode,
    };
    const template = {
      type: 'templateSource' as const,
      templateSource: source,
      preferredLoadingMode,
    };
    for (const icon of [original, template]) {
      expect(resolveIconAssetSources(icon)).toMatchObject({
        ...icon,
        preferredLoadingMode,
      });
      const [item] = prepareHeaderBarButtonItems(
        [{ type: 'button', icon, onPress: jest.fn() }],
        'right',
      );
      expect(item).toMatchObject({
        preferredImageLoadingMode: preferredLoadingMode,
      });
    }
    expect(parseAndroidIconToNativeProps(original)).toEqual({
      imageIconResource: source,
      imageIconPreferredLoadingMode: preferredLoadingMode,
    });
  },
);

it('preserves the preference on nested legacy menu images', () => {
  const icon: PlatformIconIOS = {
    type: 'imageSource',
    imageSource: source,
    preferredLoadingMode: 'synchronous',
  };
  const [item] = prepareHeaderBarButtonItems(
    [
      {
        type: 'menu',
        icon,
        menu: {
          items: [
            {
              type: 'submenu',
              icon,
              items: [{ type: 'action', icon, onPress: jest.fn() }],
            },
          ],
        },
      },
    ],
    'right',
  );
  expect(item).toMatchObject({
    preferredImageLoadingMode: 'synchronous',
    menu: {
      items: [
        {
          preferredImageLoadingMode: 'synchronous',
          items: [{ preferredImageLoadingMode: 'synchronous' }],
        },
      ],
    },
  });
});

it('does not change symbol and drawable resource icons', () => {
  const symbol = { type: 'sfSymbol' as const, name: 'star' };
  expect(resolveIconAssetSources(symbol)).toBe(symbol);
  expect(
    parseAndroidIconToNativeProps({ type: 'drawableResource', name: 'icon' }),
  ).toEqual({ drawableIconResourceName: 'icon' });
});

it('does not forward an unresolved iOS source', () => {
  jest.spyOn(Image, 'resolveAssetSource').mockReturnValue(undefined);
  expect(
    resolveIconAssetSources({
      type: 'imageSource',
      imageSource: source,
      preferredLoadingMode: 'synchronous',
    }),
  ).toBeUndefined();
});
