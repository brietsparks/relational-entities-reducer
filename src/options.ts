export interface Namespace {
  (s: string): string
}
export interface Options {
  namespace: Namespace,
}

export const defaultNamespace = (actionType: string) => `resource.${actionType}`;

export const defaultOptions = {
  namespace: defaultNamespace,
};
