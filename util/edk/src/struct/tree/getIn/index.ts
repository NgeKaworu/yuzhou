export type Key = (string | number | symbol) & any;

export default function getIn<V = any>(
  obj: Record<Key, V> | V[],
  path: Key | Key[] | readonly Key[],
): V | undefined {
  const safePath = ([] as Key[]).concat(path);
  let cur: any = obj;
  for (const key of safePath) {
    if (typeof cur !== 'object' || cur === null) return void 0;
    cur = cur?.[key as any];
  }
  return cur;
}
