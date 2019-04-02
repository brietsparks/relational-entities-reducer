const schemas = {
  skill: {
    type: 'skill',
    many: ['project']
  },
  project: {
    type: 'project',
    many: ['skill'],
    one: ['job']
  },
  job: {
    type: 'job',
    many: ['project']
  }
};

const skillSchema = schemas.skill;
const projectSchema = schemas.project;
const jobSchema = schemas.job;

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
  skillSchema,
  projectSchema,
  jobSchema,
  schemas,
  emptyState
};