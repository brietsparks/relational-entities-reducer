import { makeAdd, Creator as AddCreator } from './add';
import { Namespace } from '../options';
import { Model } from '../model';

export type Actions = {
  ADD: string, add: AddCreator
}

export interface Action { type: string }

export const createActions = (namespace: Namespace, model: Model): Actions => {
  const { TYPE: ADD, creator: add } = makeAdd(namespace, model);

  return {
    ADD,
    add
  };
};
