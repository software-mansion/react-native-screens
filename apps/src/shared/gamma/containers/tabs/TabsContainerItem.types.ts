import type { TabRoute, TabsNavigationMethods } from './TabsContainer.types';

export type TabsContainerItemProps = {
  route: TabRoute;
  navMethods: TabsNavigationMethods;
  isSelected: boolean;
  pendingForUpdate: boolean;
  Component: React.ComponentType;
}

