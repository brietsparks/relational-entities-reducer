todo:
  - action payload not showing due to es6 map
  - throw or not in selector
  - action resource type and id validation might be too strict
  - add: relation key value should accept an empty-state value
    - one-relation: undefined or null
    - many-relation: undefined or []
  - one-sided unlink of one-relation
  - link: allow omitting indices array 
  - definitive handling of relation data in edit, either allow or disallow
  - alias for regular relations

- docs:
  - explain aliases

enhancements:
- complex selectors
- normalizr adapter
- allow interceptor to be a middleware
