export const describeIfiOS = device.getPlatform() === 'ios' ? describe : describe.skip;
