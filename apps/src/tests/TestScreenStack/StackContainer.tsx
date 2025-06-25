import React from 'react';
import { ScreenStackHost, StackScreen, StackScreenLifecycleState } from 'react-native-screens';
import type { StackScreenNativeProps } from 'react-native-screens/components/gamma/StackScreen';

let id = 0;

const getId = () => {
  return ++id;
};

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
}

type Screen = Path & StackScreenNativeProps;

export const StackContainerPath = (_: Path) => {
  return null;
};

interface StackContainerProps {
   children?: {
      props: Path;
   }[];
   config?: Path[];
   options?: StackProps;
}


type StackNavigationActions = {
  pop: () => void;
  push: (name: string) => void;
}

export type StackNavigationProps = StackNavigationActions & Omit<Screen, 'component'>

const StackNavigationContext = React.createContext<StackNavigationProps | null>(null);

export const useStackNavigation = () => {
  const context = React.useContext(StackNavigationContext);

  if (context === null) {
    throw new Error('useStackNavigation hook used outside of the StackNavigationContext');
  }

  return context;
};

export const StackContainer = ({children, config}: StackContainerProps) => {
  const [stack, setStack] = React.useState<Screen[]>([]);

  const paths: Path[] = React.useMemo(() => {
    const configuredPaths = (config?.length !== undefined && config?.length)  ?  config : children?.map(child => child.props);

    if (configuredPaths?.length === undefined || configuredPaths?.length === 0) {
      throw new Error('There must be at least one path configured, please define paths using StackContainerPath components or the config prop');
    }

    return configuredPaths;
  }, [children, config]);

  const pathsMap = React.useMemo(() => Object.fromEntries(paths.map(path => [path.name, path])), [paths]);

  const push = React.useCallback((name: string) => {
    const requestedPath = pathsMap?.[name];

    if (!requestedPath) {
      throw new Error(`Path with name ${name} is not defined`);
    }

    setStack(currentStack => [
      ...currentStack,
      {
        screenKey: getId().toString(),
        lifecycleState: StackScreenLifecycleState.VISIBLE,
        ...requestedPath,
      },
    ]);
  }, [pathsMap]);

  const handlePop = React.useCallback((screenKey: string) => {
    setStack(currentStack => {
      const lastElement = currentStack.at(-1);

      if (!lastElement) {
        console.warn('Cannot pop empty stack');
        return currentStack;
      }
      if (lastElement.screenKey === screenKey) { // We need to check if it is the top most screen, as didDisappear is called also on the lower screens when new one is pushed
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
          lifecycleState: StackScreenLifecycleState.POPPED,
        },
      ];
    });
  }, [setStack]);

  React.useEffect(() => {
    if (stack.length === 0) {
      const firstPath = paths?.[0]?.name;

      if (!firstPath) {
        throw new Error('There must be at least one path defined');
      }

      push(firstPath);
    }
  }, [paths, push, stack.length]);

  console.log('StackContainer render', stack);

  return (
    <ScreenStackHost>
      {stack.map(({component: Component, ...screenProps}) => (
        <StackScreen
          key={screenProps.screenKey}
          {...screenProps}
          onPop={handlePop}
        >
          <StackNavigationContext.Provider
            value={{
                ...screenProps,
                pop,
                push,
            }}
           >
            <Component />
          </StackNavigationContext.Provider>
        </StackScreen>
      ))}
    </ScreenStackHost>
  );
};
