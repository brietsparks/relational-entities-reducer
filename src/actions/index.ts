import { makeAdd, Creator as AddCreator } from './add';
import { makeRemove, Creator as RemoveCreator } from './remove';
import { makeEdit, Creator as EditCreator } from './edit';
import { makeReindex, Creator as ReindexCreator } from './reindex';
import { Namespace } from '../options';
import { Model } from '../model';

export type Actions = {
  ADD: string, add: AddCreator,
  REMOVE: string, remove: RemoveCreator,
  EDIT: string, edit: EditCreator,
  REINDEX: string, reindex: ReindexCreator
}

export interface Action { type: string }

export const createActions = (namespace: Namespace, model: Model): Actions => {
  const { TYPE: ADD, creator: add } = makeAdd(namespace, model);
  const { TYPE: REMOVE, creator: remove } = makeRemove(namespace, model);
  const { TYPE: EDIT, creator: edit } = makeEdit(namespace, model);
  const { TYPE: REINDEX, creator: reindex } = makeReindex(namespace, model);

  return {
    ADD, add,
    REMOVE, remove,
    EDIT, edit,
    REINDEX, reindex
  };
};
