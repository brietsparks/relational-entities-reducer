import { Type, Id } from './interfaces';

export const isObject = (v: any) => {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    typeof v !== 'function'
  );
};

export const isStringOrNumber = (v: any) => typeof v === 'string' || typeof v === 'number';

export const makeCompositeId = (type: Type, id: Id) => `${type}.${id}`;
