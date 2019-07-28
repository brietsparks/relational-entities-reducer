import { Type, Id, CidString, UnlinkDefinition as Definition, RelationName, RelationKey, Index } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateRelation, validateResourceId, validateResourceType } from './validation';
import { makeCidString } from '../util';

export interface Action {
  type: string
  definitions: Map<CidString, Definition>
}

export interface Creator {
  (...definitions: InputDefinition[]): Action;
}

type DefinitionTuple = [Type, Id, RelationName|RelationKey, Id|Index, boolean?];
type InputDefinition = Definition | DefinitionTuple;

export const makeUnlink = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('UNLINK');

  const creator = (...definitions: InputDefinition[]) => {
    const outputDefinitions = new Map<CidString, Definition>();

    definitions.forEach(definition => {
      if (Array.isArray(definition)) {
        const [type, id, relation, linkedId] = definition;
        definition = { type, id, relation, linkedId };
      }

      const { type, id, relation, linkedId } = definition;

      validateResourceType(type, entities);
      validateResourceId(id);
      validateRelation(entities, type, relation);
      validateResourceId(linkedId);

      outputDefinitions.set(
        makeCidString(type, id),
        { type, id, relation, linkedId }
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
