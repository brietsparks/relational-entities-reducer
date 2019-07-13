import { RelationName, Id, Type, CidString, LinkDefinition as Definition, RelationKey } from '../interfaces';

export interface Action {
  type: string,
  definitions: Map<CidString, Definition>
}

export interface Creator {
  (...definitions: InputDefinition[]): Action;
}

type DefinitionTuple = [Type, Id, RelationName|RelationKey, Id, number?];
type InputDefinition = Definition | DefinitionTuple;
