export function someExtensiveComputation(n = 50000000): string {
  console.debug('Running extensive computation');
  let a = 100;
  for (let i = 0; i < n; i++) {
    a += 1;
  }
  return a.toString();
}
