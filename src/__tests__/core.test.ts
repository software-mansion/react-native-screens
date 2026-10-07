/**
 * The availability gate: which platforms use the native components, and how a
 * platform this library ships no native code for says that it has them anyway.
 *
 * `enableScreens()` must not be the second of those. It is public, long-standing
 * and usually called unconditionally, so widening it would make an app on
 * react-native-macos, where this library has no implementation, start mounting
 * components that are not registered.
 */
import type * as CoreModule from '../core';

// `isNativePlatformSupported` is read from `Platform.OS` when the module is first
// evaluated, so each platform needs a fresh copy of it. `requireActual` rather
// than `require` only because it takes the module's type.
function loadCore(os: string) {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: { OS: os },
    UIManager: { getViewManagerConfig: () => ({}) },
  }));
  return jest.requireActual<typeof CoreModule>('../core');
}

afterEach(() => {
  jest.resetModules();
  jest.dontMock('react-native');
});

describe('a platform this library ships native code for', () => {
  it.each(['ios', 'android', 'windows'])('uses native screens: %s', os => {
    const core = loadCore(os);
    expect(core.isNativePlatformSupported).toBe(true);
    expect(core.nativeScreensAvailable()).toBe(true);
    expect(core.screensEnabled()).toBe(true);
  });

  it('cannot be talked out of components it ships', () => {
    const core = loadCore('ios');
    core.provideNativeScreens(false);
    expect(core.nativeScreensAvailable()).toBe(true);
  });

  it('can freeze without claiming anything', () => {
    const core = loadCore('ios');
    core.enableFreeze();
    expect(core.freezeEnabled()).toBe(true);
  });
});

describe('a platform it does not', () => {
  it('falls back, and is off by default', () => {
    const core = loadCore('macos');
    expect(core.isNativePlatformSupported).toBe(false);
    expect(core.nativeScreensAvailable()).toBe(false);
    expect(core.screensEnabled()).toBe(false);
  });

  it('is not made available by enableScreens()', () => {
    const core = loadCore('macos');
    core.enableScreens();
    expect(core.nativeScreensAvailable()).toBe(false);
  });

  it('still honours enableScreens() for what it does mean', () => {
    const core = loadCore('macos');
    core.enableScreens();
    expect(core.screensEnabled()).toBe(true);
    core.enableScreens(false);
    expect(core.screensEnabled()).toBe(false);
    expect(core.nativeScreensAvailable()).toBe(false);
  });

  it('is made available by provideNativeScreens(), and only by it', () => {
    const core = loadCore('macos');
    core.provideNativeScreens();
    expect(core.nativeScreensAvailable()).toBe(true);
    core.provideNativeScreens(false);
    expect(core.nativeScreensAvailable()).toBe(false);
  });

  it('needs both calls to render native screens', () => {
    const core = loadCore('macos');
    core.provideNativeScreens();
    core.enableScreens();
    expect(core.nativeScreensAvailable()).toBe(true);
    expect(core.screensEnabled()).toBe(true);
  });

  it('cannot freeze until it has claimed the components', () => {
    // `Screen` reads `freezeEnabled()` inside the native branch, so a host able to
    // reach that branch has to be able to turn the freeze on.
    const core = loadCore('macos');
    core.enableFreeze();
    expect(core.freezeEnabled()).toBe(false);

    core.provideNativeScreens();
    core.enableFreeze();
    expect(core.freezeEnabled()).toBe(true);
    core.enableFreeze(false);
    expect(core.freezeEnabled()).toBe(false);
  });
});
