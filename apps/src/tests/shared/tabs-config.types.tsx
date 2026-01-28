import { TabConfiguration } from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { KeyList } from './helpers';
import { TabsHostProps } from 'react-native-screens';

type StaticTabScreenProps<S extends KeyList> = Omit<
  TabConfiguration['tabScreenProps'],
  'tabKey'
> & { tabKey: Extract<keyof S, string> };

export type StaticTabConfiguration<S extends KeyList> = Omit<
  TabConfiguration,
  'tabScreenProps'
> & {
  tabScreenProps: StaticTabScreenProps<S>;
};

export type StaticTabsContainerProps<S extends KeyList> = TabsHostProps & {
  tabConfigs: StaticTabConfiguration<S>[];
};

export type TabConfigUpdate<S extends KeyList> =
  | {
      type: 'tabScreen';
      tabKey: Extract<keyof S, string>;
      config: Partial<
        Omit<StaticTabConfiguration<S>, 'tabScreenProps'> & {
          tabScreenProps: Partial<StaticTabScreenProps<S>>;
        }
      >;
    }
  | {
      type: 'tabBar';
      config: Partial<Omit<StaticTabsContainerProps<S>, 'tabConfigs'>>;
    };
