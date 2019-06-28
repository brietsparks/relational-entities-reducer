const { createRootReducer } = require('./src/reducer');
const { createEntityActions } = require('./src/actions');
const selectors = require('./src/selectors');

module.exports = {
  createReducer: createRootReducer,
  createActions: createEntityActions,
  selectors
};
