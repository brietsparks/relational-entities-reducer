import { Operation, OpId } from '../interfaces';
import { Namespace } from '../options';
import { Entities } from '../schema';

import {
  makeAdd,
  Action as AddAction,
  Creator as AddActionCreator
} from './add';

import {
  makeRemove,
  Action as RemoveAction,
  Creator as RemoveActionCreator
} from './remove';

import {
  makeEdit,
  Action as EditAction,
  Creator as EditActionCreator
} from './edit';

import {
  makeLink,
  Action as LinkAction,
  Creator as LinkActionCreator
} from './link';

import {
  makeUnlink,
  Action as UnlinkAction,
  Creator as UnlinkActionCreator
} from './unlink';

import {
  makeReindexRelated,
  Action as ReindexRelatedAction,
  Creator as ReindexRelatedActionCreator
} from './reindex-related'

import {
  makeReindex,
  Action as ReindexAction,
  Creator as ReindexActionCreator
} from './reindex';

export interface ActionTypes {
  ADD: string,
  REMOVE: string,
  EDIT: string,
  LINK: string,
  UNLINK: string,
  REINDEX: string,
  REINDEX_RELATED: string
}

export interface ActionCreators {
  add: AddActionCreator,
  remove: RemoveActionCreator,
  edit: EditActionCreator,
  reindex: ReindexActionCreator,
  reindexRelated: ReindexRelatedActionCreator,
  link: LinkActionCreator,
  unlink: UnlinkActionCreator
}

export const makeActions = (entities: Entities, namespace: Namespace): { types: ActionTypes, creators: ActionCreators } => {
  const { type: ADD, creator: add } = makeAdd(entities, namespace);
  const { type: REMOVE, creator: remove } = makeRemove(entities, namespace);
  const { type: EDIT, creator: edit } = makeEdit(entities, namespace);
  const { type: REINDEX, creator: reindex } = makeReindex(entities, namespace);
  const { type: REINDEX_RELATED, creator: reindexRelated } = makeReindexRelated(entities, namespace);
  const { type: LINK, creator: link }  = makeLink(entities, namespace);
  const { type: UNLINK, creator: unlink }  = makeUnlink(entities, namespace);


  const types = { ADD, REMOVE, EDIT, REINDEX, REINDEX_RELATED, LINK, UNLINK };
  const creators = { add, remove, edit, reindex, reindexRelated, link, unlink };

  return { types, creators };
};

export {
  AddAction,
  RemoveAction,
  EditAction,
  LinkAction,
  UnlinkAction,
  ReindexRelatedAction,
  ReindexAction,
};
