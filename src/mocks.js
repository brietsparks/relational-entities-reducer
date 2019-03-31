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