import React from 'react';
import { Button, Text } from 'react-native';
import { useScrollEdgeEffectsConfigContext } from './context';
import { SettingsPicker } from '@apps/shared';
import { ScrollEdgeEffect } from 'react-native-screens';

interface ConfigProps {
  title: string;
  onGoPress?: () => void;
}

const SCROLL_EDGE_EFFECT_OPTIONS: ScrollEdgeEffect[] = [
  'automatic',
  'hard',
  'soft',
  'hidden',
];

function ConfigWithOptionalNavigation(props: ConfigProps) {
  const { title, onGoPress } = props;

  const { config, setConfig } = useScrollEdgeEffectsConfigContext();

  return (
    <>
      <Text style={{ margin: 8, fontSize: 18 }}>{title}</Text>
      <SettingsPicker
        label="bottom"
        value={config.bottom}
        items={SCROLL_EDGE_EFFECT_OPTIONS}
        onValueChange={value => setConfig({ ...config, bottom: value })}
      />
      <SettingsPicker
        label="top"
        value={config.top}
        items={['automatic', 'hard', 'soft', 'hidden']}
        onValueChange={value => setConfig({ ...config, top: value })}
      />
      <SettingsPicker
        label="left"
        value={config.left}
        items={['automatic', 'hard', 'soft', 'hidden']}
        onValueChange={value => setConfig({ ...config, left: value })}
      />
      <SettingsPicker
        label="right"
        value={config.right}
        items={['automatic', 'hard', 'soft', 'hidden']}
        onValueChange={value => setConfig({ ...config, right: value })}
      />
      {onGoPress && <Button title="Go" onPress={onGoPress} />}
    </>
  );
}

export function Config(props: Pick<ConfigProps, 'title'>) {
  return <ConfigWithOptionalNavigation title={props.title} />;
}

export function ConfigWithNavigation(props: Required<ConfigProps>) {
  return <ConfigWithOptionalNavigation {...props} />;
}
