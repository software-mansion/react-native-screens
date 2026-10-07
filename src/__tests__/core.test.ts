/**
 * The availability gate: which platforms use the native components, and how a
 * platform this library ships no native code for says that it has them anyway.
 *
 * The case worth protecting is the third one. `enableScreens()` is public,
 * long-standing and usually called unconditionally, and on a platform without
 * native screens it means "use them where they exist" and keeps the fallback.
 * An earlier revision of this change made that call double as the capability
 * assertion, which would have made an app on react-native-macos, where this
 * library has no implementation, start mounting components that are not
 * registered. Nothing distinguishes such a caller from a host making a claim, so
 * the claim has its own call and this says so.
 */

// Type-only, so it is erased and does not defeat the `resetModules` below. It
// names the shape of the module rather than importing its values, which is what
// `import type` is for and what this repository uses everywhere else.
import type * as CoreModule from '../core';

// `isNativePlatformSupported` is a module-level const read from `Platform.OS` at
// import time, so each platform needs its own fresh copy of the module. core.ts
// uses exactly these two imports, which is why the mock can be this small.
function loadCore(os: string): typeof CoreModule {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: { OS: os },
    UIManager: { getViewManagerConfig: () => ({}) },
  }));
  // `require` rather than `import`, which is the point: an import is hoisted and
  // cached, and this needs the module re-evaluated after each `doMock`. The rule
  // is named rather than disabled wholesale.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../core') as typeof CoreModule;
}

afterEach(() => {
  jest.resetModules();
  jest.dontMock('react-native');
});

describe('a platform this library ships native code for', () => {
  it.each(['ios', 'android', 'windows'])('uses native screens by default: %s', os => {
    const core = loadCore(os);
    expect(core.isNativePlatformSupported).toBe(true);
    expect(core.nativeScreensAvailable()).toBe(true);
    expect(core.screensEnabled()).toBe(true);
  });

  it('needs no claim, already having the components', () => {
    const core = loadCore('ios');
    expect(core.nativeScreensAvailable()).toBe(true);
    core.provideNativeScreens(false);
    // Still available: the platform term is what answers here, and a host cannot
    // talk this library out of code it ships.
    expect(core.nativeScreensAvailable()).toBe(true);
  });
});

describe('a platform it does not', () => {
  it('falls back, and is not enabled by default', () => {
    const core = loadCore('macos');
    expect(core.isNativePlatformSupported).toBe(false);
    expect(core.nativeScreensAvailable()).toBe(false);
    expect(core.screensEnabled()).toBe(false);
  });

  it('is not made available by enableScreens()', () => {
    // The regression this file exists for. An app that calls enableScreens()
    // unconditionally, which is most of them, must keep the fallback on a platform
    // where the native components are not registered.
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
    // And neither call touched availability.
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
    // The two answer different questions: whether the components exist, and
    // whether to use them. A host says both.
    const core = loadCore('macos');
    core.provideNativeScreens();
    core.enableScreens();
    expect(core.nativeScreensAvailable()).toBe(true);
    expect(core.screensEnabled()).toBe(true);
  });
});
