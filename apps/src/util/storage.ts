import { createAsyncStorage } from '@react-native-async-storage/async-storage';

const asyncStorage = createAsyncStorage('@react-native-screens');

const StorageKey = {
  LastVisitedScreen: 'lastVisitedScreen',
} as const;

interface LastVisitedScreen {
  name: string;
  parent?: string;
}

export const storage = {
  setLastVisitedScreen: async (screen: LastVisitedScreen) => {
    await asyncStorage.setItem(
      StorageKey.LastVisitedScreen,
      JSON.stringify(screen),
    );
  },
  getLastVisitedScreen: async (): Promise<LastVisitedScreen | null> => {
    const item = await asyncStorage.getItem(StorageKey.LastVisitedScreen);

    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },
  clear: () => {
    return asyncStorage.clear();
  },
};
