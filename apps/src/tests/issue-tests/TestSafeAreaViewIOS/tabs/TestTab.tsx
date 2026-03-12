import { useMemo } from 'react';
import { useTabsSAVExampleContext } from './TabsSAVExampleContext';
import { mapContentStringToComponent } from '../shared';

export default function TestTab() {
  const { config } = useTabsSAVExampleContext();

  let content = useMemo(
    () => mapContentStringToComponent(config.content),
    [config.content],
  );

  return content;
}
