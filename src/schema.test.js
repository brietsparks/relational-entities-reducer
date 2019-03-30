const skillSchema = {
  type: 'skill',
  plural: 'skills',
  many: ['project'],
};

const projectSchema = {
  type: 'project',
  plural: 'skills',
  many: ['skill'],
  one: ['job']
};

const jobSchema = {
  type: 'job',
  plural: 'jobs',
  many: ['project']
};

describe('parseSchema', () => {
  test('', () => {

  });
});