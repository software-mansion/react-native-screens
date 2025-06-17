import React from 'react';
import { ScreenStackHost, StackScreen } from 'react-native-screens';

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

interface Path {
  name: string;
  component: () => React.ReactNode;
  options?: ScreenProps;
}

interface ConcretePath extends Path {
  id: number;
}

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

export type StackNavigationProps = {
  name: string;
  id: number;
  pop: () => void;
  push: (name: string) => void;
}

const StackNavigationContext = React.createContext<StackNavigationProps | null>(null);

export const useStackNavigation = () => {
  const context = React.useContext(StackNavigationContext);

  if (context === null) {
    throw new Error('useStackNavigation hook used outside of the StackNavigationContext');
  }

  return context;
};

export const StackContainer = ({children, config}: StackContainerProps) => {
  const [stack, setStack] = React.useState<ConcretePath[]>([]);

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
        id: getId(),
        ...requestedPath,
      },
    ]);
  }, [pathsMap]);

  const pop = React.useCallback(() => {
    setStack(currentStack => {
      if (currentStack.length < 2) {
        console.warn('Can not pop initial path');
        return currentStack;
      }

      return currentStack.slice(0, -1);
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

  console.log('StackContainer render', paths, pathsMap, stack);

  return (
    <ScreenStackHost>
      {stack.map(stackItem => (
        <StackScreen key={stackItem.id}>
          <StackNavigationContext.Provider
            value={{
                name: stackItem.name,
                id: stackItem.id,
                pop,
                push,
            }}
           >
            <stackItem.component />
          </StackNavigationContext.Provider>
        </StackScreen>
      ))}
    </ScreenStackHost>
  );
};
