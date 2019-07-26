import { Type, Id, OpId } from './interfaces';

export const isObjectLiteral = (v: any): v is object => {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    typeof v !== 'function'
  );
};

export const isString = (v: any) => typeof v === 'string';

export const isStringOrNumber = (v: any) => typeof v === 'string' || typeof v === 'number';

export const makeOpId = (type: Type, id: Id): OpId => {
  return `${type}.${id}`;
};

export const isNonNegativeInteger = (v: any): v is number => {
  return Number.isInteger(v) && v > -1;
};

export function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

// enables es5 support without ts downlevelIteration
export function mergeSets<T> (...iterables: Set<T>[]): Set<T> {
  const set = new Set<T>();
  iterables.forEach(iterable => {
    iterable.forEach(item => set.add(item))
  });
  return set
}

// enables es5 support without ts downlevelIteration
export const mergeMaps = <K,V>(...iterables: Map<K,V>[]) => {
  const map = new Map<K,V>();

  iterables.forEach(iterable => {
    iterable.forEach((value, key) => map.set(key, value));
  });

  return map;
};
