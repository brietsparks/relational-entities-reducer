const skillSchema = {
  type: 'skill',
  many: ['project']
};

const projectSchema = {
  type: 'project',
  many: ['skill'],
  one: ['job']
};

const jobSchema = {
  type: 'job',
  many: ['project']
};

const schemas = {
  skill: skillSchema,
  project: projectSchema,
  job: jobSchema
};

const emptyState = {
  entities: {
    skill: {},
    project: {},
    job: {}
  },
  ids: {
    skill: [],
    project: [],
    job: []
  }
};

module.exports = {
  skillSchema,
  projectSchema,
  jobSchema,
  schemas,
  emptyState
};