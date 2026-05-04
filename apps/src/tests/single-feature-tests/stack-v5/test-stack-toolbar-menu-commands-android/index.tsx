import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import {
  createScenario,
  ScenarioDescription,
} from '@apps/tests/shared/helpers';
import {
  StackContainerWithDynamicRouteConfigs,
  useStackNavigationContext,
  useStackRouteConfigContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigRef,
  type ToolbarMenuItemOptionsAndroid,
} from 'react-native-screens/experimental';

const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Commands',
  key: 'test-stack-toolbar-menu-commands-android',
  details: 'Tests toolbar menu items prop config and imperative commands.',
  platforms: ['android'],
};

type IdOption = 'item-1' | 'item-2' | 'item-3';
type TitleOption = 'Title A' | 'Title B' | 'Title C' | 'Long Title' | 'Changed';

const ID_OPTIONS: IdOption[] = ['item-1', 'item-2', 'item-3'];
const TITLE_OPTIONS: TitleOption[] = [
  'Title A',
  'Title B',
  'Title C',
  'Long Title',
  'Changed',
];

interface SlotConfig {
  include: boolean;
  id: IdOption;
  title: TitleOption;
  hidden: boolean;
}

type Slots = [SlotConfig, SlotConfig, SlotConfig];

const DEFAULT_SLOTS: Slots = [
  { include: true, id: 'item-1', title: 'Title A', hidden: false },
  { include: true, id: 'item-2', title: 'Title B', hidden: false },
  { include: true, id: 'item-3', title: 'Title C', hidden: false },
];

function buildItems(slots: Slots) {
  return slots
    .filter(s => s.include)
    .map(({ id, title, hidden }) => ({ id, title, hidden }));
}

function updateSlotAt(
  slots: Slots,
  index: number,
  patch: Partial<SlotConfig>,
): Slots {
  return slots.map((s, i) => (i === index ? { ...s, ...patch } : s)) as Slots;
}

const InitialSlotsContext = React.createContext<{
  initialSlots: Slots;
  setInitialSlots: React.Dispatch<React.SetStateAction<Slots>>;
}>({
  initialSlots: DEFAULT_SLOTS,
  setInitialSlots: () => {},
});

export function App() {
  const [initialSlots, setInitialSlots] = useState<Slots>(DEFAULT_SLOTS);

  return (
    <InitialSlotsContext.Provider value={{ initialSlots, setInitialSlots }}>
      <StackContainerWithDynamicRouteConfigs
        routeConfigs={[
          { name: 'Root', Component: RootScreen, options: {} },
          { name: 'Pushed', Component: PushedScreen, options: {} },
        ]}
      />
    </InitialSlotsContext.Provider>
  );
}

function RootScreen() {
  const { initialSlots, setInitialSlots } =
    React.useContext(InitialSlotsContext);
  const { updateRouteConfigWithOptions } = useStackRouteConfigContext();
  const { push, setRouteOptions, routeKey } = useStackNavigationContext();

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: { title: 'Menu Commands Test' },
    });
  }, [setRouteOptions, routeKey]);

  useEffect(() => {
    updateRouteConfigWithOptions('Pushed', {
      headerConfig: {
        title: 'Toolbar Menu Commands Test',
        android: { toolbarMenuItems: buildItems(initialSlots) },
      },
    });
  }, [initialSlots, updateRouteConfigWithOptions]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Initial Items for Screen 2</Text>
      <SlotControls
        slots={initialSlots}
        updateSlot={(i, patch) =>
          setInitialSlots(prev => updateSlotAt(prev, i, patch))
        }
      />
      <Text style={styles.heading}>Navigation</Text>
      <Button title="Push Screen 2" onPress={() => push('Pushed')} />
    </ScrollView>
  );
}

function PushedScreen() {
  const { initialSlots } = React.useContext(InitialSlotsContext);
  const [slots, setSlots] = useState<Slots>(() => initialSlots);
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<IdOption>('item-1');
  const [cmdTitle, setCmdTitle] = useState<TitleOption>('Changed');
  const [cmdHidden, setCmdHidden] = useState(false);

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfigRef });
  }, [setRouteOptions, routeKey]);

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: 'Toolbar Menu Commands Test',
        android: {
          toolbarMenuItems: buildItems(slots),
          onToolbarMenuItemClicked: id => setLastClicked(id),
        },
      },
    });
  }, [slots, setRouteOptions, routeKey]);

  const sendCommand = useCallback(() => {
    const options: ToolbarMenuItemOptionsAndroid = {
      title: cmdTitle,
      hidden: cmdHidden,
    };
    headerConfigRef.current?.android?.setToolbarMenuItemOptions(
      cmdTargetId,
      options,
    );
  }, [cmdTargetId, cmdTitle, cmdHidden]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<IdOption>
        label="target id"
        value={cmdTargetId}
        items={ID_OPTIONS}
        onValueChange={setCmdTargetId}
      />
      <SettingsPicker<TitleOption>
        label="title"
        value={cmdTitle}
        items={TITLE_OPTIONS}
        onValueChange={setCmdTitle}
      />
      <SettingsSwitch
        label="hidden"
        value={cmdHidden}
        onValueChange={setCmdHidden}
      />
      <Button title="Send Command" onPress={sendCommand} />

      <Text style={styles.heading}>Result</Text>
      <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

      <Text style={styles.heading}>Menu Items — Props</Text>
      <SlotControls
        slots={slots}
        updateSlot={(i, patch) =>
          setSlots(prev => updateSlotAt(prev, i, patch))
        }
      />
    </ScrollView>
  );
}

interface SlotControlsProps {
  slots: Slots;
  updateSlot: (index: number, patch: Partial<SlotConfig>) => void;
}

function SlotControls({ slots, updateSlot }: SlotControlsProps) {
  return (
    <>
      {slots.map((slot, i) => (
        <React.Fragment key={i}>
          <Text style={styles.slotLabel}>
            Slot {i + 1} (item-{i + 1})
          </Text>
          <SettingsSwitch
            label="include"
            value={slot.include}
            onValueChange={v => updateSlot(i, { include: v })}
          />
          <SettingsPicker<TitleOption>
            label="title"
            value={slot.title}
            items={TITLE_OPTIONS}
            onValueChange={v => updateSlot(i, { title: v })}
          />
          <SettingsSwitch
            label="hidden"
            value={slot.hidden}
            onValueChange={v => updateSlot(i, { hidden: v })}
          />
        </React.Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 10,
    paddingBottom: 50,
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  slotLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  result: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default createScenario(App, scenarioDescription);
