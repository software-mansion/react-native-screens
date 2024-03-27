import {Platform, Settings} from "react-native";
import {useCallback, useState} from "react";

// TODO: Add concrete Android implementation

function getSettings<T>(settingsKey: string) {
  if (Platform.OS === "android") {
    return undefined;
  }

  const value = Settings.get(settingsKey);
  if (value && typeof value === "string") {
    return JSON.parse(value) as T;
  }
  return undefined;
}

function setSettings<T>(settingsKey: string, settings: Partial<T>) {
  if (Platform.OS === "android") {
    return;
  }
  const curSettings = getSettings<T>(settingsKey);
  const newValue = {
    ...curSettings,
    ...settings,
  };
  Settings.set({
    [settingsKey]: JSON.stringify(newValue),
  });
}

function resetSettings(settingsKey: string) {
  Settings.set({
    [settingsKey]: null,
  });
}

export function useSettings<T>(settingsKey: string, defaultValue: T) {
  const [settings, setSettingState] = useState<T>(
    getSettings<T>(settingsKey) ?? defaultValue,
  );

  const updateSettings = useCallback(
    (data: Partial<T>) => {
      setSettings(settingsKey, data);
      const update = getSettings<T>(settingsKey);
      if (update) {
        setSettingState(update);
      }
    },
    [settingsKey],
  );

  const clearAll = useCallback(() => {
    setSettings<T>(settingsKey, defaultValue);
  }, [settingsKey, defaultValue]);

  return {
    settings,
    updateSettings,
    clearAll,
  };
}
