import { TabConfiguration } from '../../shared/gamma/containers/tabs/TabsContainer';
import { KeyList } from './helpers';
import { TabsHostProps } from 'react-native-screens';

type StaticTabScreenProps<S extends KeyList> = Omit<
  TabConfiguration['options'],
  'screenKey'
> & { screenKey: Extract<keyof S, string> };

export type StaticTabConfiguration<S extends KeyList> = Omit<
  TabConfiguration,
  'options'
> & {
  options: StaticTabScreenProps<S>;
};

export type StaticTabsContainerProps<S extends KeyList> = TabsHostProps & {
  tabConfigs: StaticTabConfiguration<S>[];
};

export type TabConfigUpdate<S extends KeyList> =
  | {
      type: 'tabScreen';
      screenKey: Extract<keyof S, string>;
      config: Partial<
        Omit<StaticTabConfiguration<S>, 'options'> & {
          options: Partial<StaticTabScreenProps<S>>;
        }
      >;
    }
  | {
      type: 'tabBar';
      config: Partial<Omit<StaticTabsContainerProps<S>, 'tabConfigs'>>;
    };
