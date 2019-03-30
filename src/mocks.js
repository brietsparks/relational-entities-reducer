const skillSchema = {
  type: 'skill',
  plural: 'skills',
  many: ['project']
};

const projectSchema = {
  type: 'project',
  plural: 'projects',
  many: ['skill'],
  one: ['job']
};

const jobSchema = {
  type: 'job',
  plural: 'jobs',
  many: ['project']
};

const schemas = {
  skill: skillSchema,
  project: projectSchema,
  job: jobSchema
};

const emptyState = {
  entities: {
    skills: {},
    projects: {},
    jobs: {}
  },
  keys: {
    skillKeys: [],
    projectKeys: [],
    jobKeys: []
  }
};

module.exports = {
  skillSchema,
  projectSchema,
  jobSchema,
  schemas,
  emptyState
};