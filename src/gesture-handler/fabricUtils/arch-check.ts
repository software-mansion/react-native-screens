export type LocalGlobal = typeof global & Record<string, unknown>;

export function isFabric() {
  return !!(global as LocalGlobal)._IS_FABRIC;
}
