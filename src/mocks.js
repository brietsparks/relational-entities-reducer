const schemaDefs = {
  skill: {
    type: 'skill',
    many: ['project'],
    one: []
  },
  project: {
    type: 'project',
    many: ['skill'],
    one: ['job']
  },
  job: {
    type: 'job',
    many: ['project'],
    one: []
  }
};

const emptyState = {
  skill: {
    entities: {},
    ids: []
  },
  project: {
    entities: {},
    ids: []
  },
  job: {
    entities: {},
    ids: []
  },
};

module.exports = {
  schemaDefs,
  emptyState
};