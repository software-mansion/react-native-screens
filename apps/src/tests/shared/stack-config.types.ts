import { RouteConfigProps } from '@react-navigation/native';
import { KeyList } from './helpers';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export type StackScreenConfig<S extends KeyList> = RouteConfigProps<
  S,
  keyof S,
  any,
  any,
  any,
  any
> & { component: React.ComponentType };

export type StackConfigUpdate<S extends KeyList> = {
  type: 'screen';
  name: Extract<keyof S, string>;
  config: NativeStackNavigationOptions;
};
