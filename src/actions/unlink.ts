import { Type, Id, CidString, UnlinkDefinition as Definition, RelationName, RelationKey, Index } from '../interfaces';

export interface Action {
  type: string
  definitions: Map<CidString, Definition>
}

export interface Creator {
  (...definitions: Definition[]): Action;
}

type DefinitionTuple = [Type, Id, RelationName|RelationKey, Id|Index, boolean?];
type InputDefinition = Definition | DefinitionTuple;
