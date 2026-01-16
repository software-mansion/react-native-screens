export interface Scenario {
  name: string;
  key: string;
  details?: string;
  platforms?: ('android' | 'ios')[];
  screen: React.ComponentType;
}

export type KeyList = Record<keyof any, undefined>;

const UC_REGEX = /[A-Z][^A-Z]+/g;

export function ucsplit(str: string) {
  if (str.length === 0) {
    return '';
  }

  const matches = [...str.matchAll(UC_REGEX)];

  return matches.map(m => m.at(0) ?? '').join(' ');
}
