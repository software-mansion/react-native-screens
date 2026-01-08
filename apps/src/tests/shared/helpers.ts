export interface Scenario {
  name: string;
  key: string;
  details?: string;
  platforms?: ('android' | 'ios')[],
  screen: React.ComponentType;
}