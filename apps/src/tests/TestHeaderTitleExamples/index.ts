import BasicApp from './BasicApp';
import BackTitleApp from './BackTitleApp';
import LargeTitleApp from './LargeTitleApp';

interface Example {
  name: string;
  component: React.FC;
}

export const EXAMPLES: Example[] = [
  {
    name: 'BasicApp',
    component: BasicApp,
  },
  {
    name: 'BackTitleApp',
    component: BackTitleApp,
  },
  {
    name: 'LargeTitleApp',
    component: LargeTitleApp,
  },
];

export type ExampleRouteName = keyof typeof EXAMPLES;
