import { Model } from '../model';
import { Data, Id, IdsState, Type } from '../model/resource';
import { BatchWriteAction } from '.';
import { isObject } from '../util';

interface Actions { ADD: string }
interface Action { type: string }
export type Reducer = (state: IdsState|undefined, action: Action) => IdsState;

interface AddAction extends Action {
  ids: { [type in Type]: Id[] }
}

export const createIdsReducer = (type: Type, actions: Actions): Reducer => {
  const emptyState = Model.getEmptyIdsState();

  return (state = emptyState, action: Action) => {
    switch (action.type) {
      case actions.ADD: {
        const addAction = action as AddAction;

        const addableIds = addAction.ids[type];

        if (!Array.isArray(addableIds)) {
          return state;
        }

        return [...state, ...addableIds];
      }
      default:
        return state;
    }
  }
};
