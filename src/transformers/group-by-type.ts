import { Operation, OpId, Id, OperationsByType } from '../interfaces';

export default function groupByType(operations: Map<OpId, Operation>): OperationsByType {
  const grouped: OperationsByType = {};

  operations.forEach((operation) => {
    if (!(grouped[operation.type] instanceof Map)) {
      grouped[operation.type] = new Map<Id, Operation>();
    }

    grouped[operation.type].set(operation.id, operation);
  });

  return grouped;
}
