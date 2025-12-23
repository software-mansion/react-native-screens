import React from 'react';
import {
  Stack,
} from 'react-native-screens/experimental';
import type { StackScreenProps } from 'react-native-screens/experimental';

let id = 0;

function getId() {
  return ++id;
}

interface StackProps {
  // TBA
}

interface ScreenProps {
  // TBA
}

type Path = {
  name: string;
  component: () => React.ReactNode;
  options?: ScreenProps;
};

type Screen = Path & StackScreenProps;

export const StackContainerPath = (_: Path) => {
  return null;
};

interface StackContainerProps {
  pathConfigs: Path[];
  options?: StackProps;
}

type StackNavigationActions = {
  pop: () => void;
  push: (name: string) => void;
};

export type StackNavigationProps = StackNavigationActions &
  Omit<Screen, 'component'>;

const StackNavigationContext = React.createContext<StackNavigationProps | null>(
  null,
);

export function useStackNavigation() {
  const context = React.useContext(StackNavigationContext);

  if (context === null) {
    throw new Error(
      'useStackNavigation hook used outside of the StackNavigationContext',
    );
  }

  return context;
}

function requireNotEmptyPaths(pathConfigs?: Path[]) {
  if (pathConfigs == null || pathConfigs.length === 0) {
    throw new Error('[RNScreens] There must be at least one path configured');
  }
}

export function StackContainer({ pathConfigs }: StackContainerProps) {
  requireNotEmptyPaths(pathConfigs);

  const [stack, setStack] = React.useState<Screen[]>([]);

  const pathsMap = React.useMemo(
    () => Object.fromEntries(pathConfigs.map(config => [config.name, config])),
    [pathConfigs],
  );

  const push = React.useCallback(
    (name: string) => {
      const requestedPath = pathsMap[name];

      if (!requestedPath) {
        throw new Error(`Path with name ${name} is not defined`);
      }

      setStack(currentStack => [
        ...currentStack,
        {
          screenKey: getId().toString(),
          activityMode: 'attached',
          ...requestedPath,
        },
      ]);
    },
    [pathsMap],
  );

  const handlePop = React.useCallback((screenKey: string) => {
    setStack(currentStack => {
      const lastElement = currentStack.at(-1);

      if (!lastElement) {
        console.warn('Cannot pop empty stack');
        return currentStack;
      }

      // We need to check if it is the top most screen, as didDisappear is called also on the lower screens when new one is pushed
      if (lastElement.screenKey === screenKey) {
        return currentStack.slice(0, -1);
      }

      return currentStack;
    });
  }, []);

  const pop = React.useCallback(() => {
    setStack(currentStack => {
      if (currentStack.length < 2) {
        console.warn('Cannot pop initial path');
        return currentStack;
      }
      const lastElement = currentStack.pop()!; // We know that's not undefined, cause we check the length being >= 1

      return [
        ...currentStack, // This is mutated through pop()
        {
          ...lastElement,
          activityMode: 'detached',
        },
      ];
    });
  }, [setStack]);

  React.useEffect(() => {
    if (stack.length === 0) {
      const firstPath = pathConfigs[0].name;

      if (!firstPath) {
        throw new Error('There must be at least one path defined');
      }

      push(firstPath);
    }
  }, [pathConfigs, push, stack.length]);

  console.log('StackContainer render', stack);

  return (
    <Stack.Host>
      {stack.map(({ component: Component, ...screenProps }) => (
        <Stack.Screen
          key={screenProps.screenKey}
          {...screenProps}
          onPop={handlePop}>
          <StackNavigationContext.Provider
            value={{
              ...screenProps,
              pop,
              push,
            }}>
            <Component />
          </StackNavigationContext.Provider>
        </Stack.Screen>
      ))}
    </Stack.Host>
  );
}
