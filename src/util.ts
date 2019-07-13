import { Type, Id } from './interfaces';

export const isObjectLiteral = (v: any) => {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    typeof v !== 'function'
  );
};

export const isString = (v: any) => typeof v === 'string';

export const isStringOrNumber = (v: any) => typeof v === 'string' || typeof v === 'number';

export const makeCompositeId = (type: Type, id: Id) => `${type}.${id}`;

export function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
