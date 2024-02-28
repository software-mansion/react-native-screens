import * as React from 'react';

import { useNavigation } from '@react-navigation/native';

type EffectCallback = () => undefined | void | (() => void);

/**
 * Hook to run an effect in a focused screen, similar to `React.useEffect`.
 * This can be used to perform side-effects such as fetching data or subscribing to events.
 * The passed callback should be wrapped in `React.useCallback` to avoid running the effect too often.
 *
 * @param callback Memoized callback containing the effect, should optionally return a cleanup function.
 */
export default function useFocusEffectIgnoreSheet(
  effect: EffectCallback,
  ignoredRouteName: string,
) {
  const navigation = useNavigation();
  const navigationState = navigation.getState();

  console.log('Navigation object');
  // console.log(`${JSON.stringify(navigationState)}`);

  const currentRouteIndex = navigationState.index;
  const currentRoute = navigationState.routes[currentRouteIndex];
  const currentRouteName = currentRoute.name;

  console.log(
    `currentRouteName: ${currentRouteName}, index: ${currentRouteIndex}`,
  );

  if (arguments[2] !== undefined) {
    const message =
      "You passed a second argument to 'useFocusEffect', but it only accepts one argument. " +
      "If you want to pass a dependency array, you can use 'React.useCallback':\n\n" +
      'useFocusEffect(\n' +
      '  React.useCallback(() => {\n' +
      '    // Your code here\n' +
      '  }, [depA, depB])\n' +
      ');\n\n' +
      'See usage guide: https://reactnavigation.org/docs/use-focus-effect';

    console.error(message);
  }

  React.useEffect(() => {
    console.log('USE_EFFECT_CALLBACK called');
    let isFocused = false;
    let cleanup: undefined | void | (() => void);

    const callback = () => {
      console.log('CALLBACK_WRAPPER called');

      const destroy = effect();

      if (destroy === undefined || typeof destroy === 'function') {
        return destroy;
      }

      if (process.env.NODE_ENV !== 'production') {
        let message =
          'An effect function must not return anything besides a function, which is used for clean-up.';

        if (destroy === null) {
          message +=
            " You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing).";
        } else if (typeof (destroy as any).then === 'function') {
          message +=
            "\n\nIt looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise. " +
            'Instead, write the async function inside your effect ' +
            'and call it immediately:\n\n' +
            'useFocusEffect(\n' +
            '  React.useCallback(() => {\n' +
            '    async function fetchData() {\n' +
            '      // You can await here\n' +
            '      const response = await MyAPI.getData(someId);\n' +
            '      // ...\n' +
            '    }\n\n' +
            '    fetchData();\n' +
            '  }, [someId])\n' +
            ');\n\n' +
            'See usage guide: https://reactnavigation.org/docs/use-focus-effect';
        } else {
          message += ` You returned '${JSON.stringify(destroy)}'.`;
        }

        console.error(message);
      }
    };

    console.log(
      `USE_EFFECT_CALLBACK BEFORE_CHECK currentRoute name: ${currentRouteName}, index: ${currentRouteIndex}`,
    );

    // We need to run the effect on intial render/dep changes if the screen is focused
    if (navigation.isFocused() || currentRouteName === ignoredRouteName) {
      cleanup = callback();
      isFocused = true;
    }

    console.log(`USE_EFFECT_CALLBACK Adding FOCUS listener`);
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log(
        `FOCUS_CALLBACK currentRoute params: ${currentRouteName}, index: ${currentRouteIndex}`,
      );
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      if (cleanup !== undefined) {
        console.log('Cleanup function called in FOCUS_CALLBACK');
        cleanup();
      }

      cleanup = callback();
      isFocused = true;
    });

    console.log(`USE_EFFECT_CALLBACK Adding STATE listener`);
    const unsubscribeState = navigation.addListener('state', event => {
      const state = event.data.state;
      const newRouteInd = state.index;
      const newRouteName = state.routes[newRouteInd].name;

      console.log(
        `STATE_CALLBACK routeName: ${newRouteName}, index: ${newRouteInd}`,
      );

      // We need to check whether current route is different from last
      if (newRouteName === currentRouteName || isFocused) {
        console.log(`STATE_CALLBACK early return isFocused: ${isFocused}`);
        return;
      }

      if (cleanup !== undefined) {
        cleanup();
      }

      if (newRouteName === ignoredRouteName) {
        cleanup = callback();
      }

      // cleanup = undefined;
    });

    console.log(`USE_EFFECT_CALLBACK Adding BLUR listener`);
    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log(
        `BLUR_CALLBACK currentRoute params: ${currentRouteName}, index: ${currentRouteIndex}`,
      );
      if (cleanup !== undefined) {
        console.log('Cleanup function called in BLUR_CALLBACK');
        cleanup();
      }

      cleanup = undefined;
      isFocused = false;
    });

    return () => {
      console.log('USE_EFFECT_CALLBACK cleanup');
      if (cleanup !== undefined) {
        console.log('USE_EFFECT_CALLBACK calling users cleanup');
        cleanup();
      }

      console.log(
        'USE_EFFECT_CALLBACK cleanup, removing listeners of all events',
      );
      unsubscribeFocus();
      unsubscribeState();
      unsubscribeBlur();
    };
  }, [
    effect,
    navigation,
    currentRouteName,
    ignoredRouteName,
    currentRouteIndex,
  ]);
}
