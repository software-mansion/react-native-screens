import { useMemo } from 'react';
import { useBottomTabsSAVExampleContext } from './BottomTabsSAVExampleContext';
import { mapContentStringToComponent } from '../shared';

export default function TestTab() {
  const { config } = useBottomTabsSAVExampleContext();

  let content = useMemo(
    () => mapContentStringToComponent(config.content),
    [config.content],
  );

  return content;
}
