import SplitViewHost from './SplitViewHost';
import SplitViewScreen from './SplitViewScreen';

export * from './SplitViewHost.types';
export * from './SplitViewScreen.types';

const Split = {
  Host: SplitViewHost,
  Column: SplitViewScreen.Column,
  Inspector: SplitViewScreen.Inspector,
};

export default Split;
