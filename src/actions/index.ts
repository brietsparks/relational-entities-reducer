import { makeAdd, Creator as AddCreator } from './add';
import { makeRemove, Creator as RemoveCreator } from './remove';
import { Namespace } from '../options';
import { Model } from '../model';

export type Actions = {
  ADD: string, add: AddCreator,
  REMOVE: string, remove: RemoveCreator
}

export interface Action { type: string }

export const createActions = (namespace: Namespace, model: Model): Actions => {
  const { TYPE: ADD, creator: add } = makeAdd(namespace, model);
  const { TYPE: REMOVE, creator: remove } = makeRemove(namespace, model);

  return {
    ADD, add,
    REMOVE, remove
  };
};
