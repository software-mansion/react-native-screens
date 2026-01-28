import { createContext, Dispatch } from 'react';
import type {
  StackConfigUpdate,
  StackScreenConfig,
} from '../stack-config.types';

export const StackConfigContext = createContext<StackScreenConfig<any>[]>([]);
export const StackConfigDispatchContext = createContext<
  Dispatch<StackConfigUpdate<any>>
>(() => {});
