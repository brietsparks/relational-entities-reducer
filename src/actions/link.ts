import { RelationName, Id, Type, CidString, LinkDefinition as Definition, RelationKey, Index } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateResourceType, validateResourceId, validateRelation } from './validation';
import { makeCidString } from '../util';

export interface Action {
  type: string,
  definitions: Map<CidString, Definition>
}

export interface Creator {
  (...definitions: InputDefinition[]): Action;
}

type DefinitionTuple = [Type, Id, RelationName|RelationKey, Id, [Index?, Index?]];
type InputDefinition = Definition | DefinitionTuple;

export const makeLink = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('LINK');

  const creator = (...definitions: InputDefinition[]): Action => {
    const outputDefinitions = new Map<CidString, Definition>();

    definitions.forEach(definition => {
      if (Array.isArray(definition)) {
        const [type, id, relation, linkedId, indices] = definition;
        definition = { type, id, relation, linkedId, indices };
      }

      const { type, id, relation, linkedId, indices } = definition;

      validateResourceType(type, entities);
      validateResourceId(id);
      validateRelation(entities, type, relation);
      validateResourceId(linkedId);
      // todo: validate indices

      outputDefinitions.set(
        makeCidString(type, id),
        { type, id, relation, linkedId, indices }
      )
    });

    return {
      type: actionType,
      definitions: outputDefinitions
    }
  };

  return {
    type: actionType,
    creator
  }
};
