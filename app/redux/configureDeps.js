import apiCommands from '../api/apiCommands';
import apiQueries from '../api/apiQueries';

// eslint-disable-next-line no-unused-vars
const configureDeps = (initialState, platformDeps, storageEngine) => ({
  now: () => Date.now(),
  apiCommands,
  apiQueries,
});

export default configureDeps;
