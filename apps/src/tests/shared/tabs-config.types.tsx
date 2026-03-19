import type { TabRouteConfig, TabRouteOptions, TabsContainerProps } from '../../shared/gamma/containers/tabs';
import { KeyList } from './helpers';

export type StaticTabConfiguration<S extends KeyList> = Omit<
  TabRouteConfig,
  'name'
> & {
  name: Extract<keyof S, string>;
};

export type StaticTabsContainerProps<S extends KeyList> = Omit<
  TabsContainerProps,
  'routeConfigs'
> & {
  routeConfigs: StaticTabConfiguration<S>[];
};

export type TabConfigUpdate<S extends KeyList> =
  | {
      type: 'tabScreen';
      name: Extract<keyof S, string>;
      config: Partial<
        Omit<StaticTabConfiguration<S>, 'options'> & {
          options: Partial<TabRouteOptions>;
        }
      >;
    }
  | {
      type: 'tabBar';
      config: Partial<Omit<StaticTabsContainerProps<S>, 'routeConfigs'>>;
    };
