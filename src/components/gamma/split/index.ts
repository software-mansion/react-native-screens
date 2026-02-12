import SplitHost from './SplitHost';
import SplitScreen from './SplitScreen';

export * from './SplitHost.types';
export * from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Split = {
  Host: SplitHost,
  Column: SplitScreen.Column,
  Inspector: SplitScreen.Inspector,
};

export default Split;
