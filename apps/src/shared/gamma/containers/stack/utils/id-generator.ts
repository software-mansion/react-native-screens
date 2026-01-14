let GLOBAL_ID = 0;

export function generateID(): number {
  const nextID = GLOBAL_ID;
  GLOBAL_ID += 1;
  return nextID;
}

