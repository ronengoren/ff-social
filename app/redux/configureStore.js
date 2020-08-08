import {applyMiddleware, createStore, compose} from 'redux';
import configureDeps from './configureDeps';
import configureReducer from './configureReducer';
import configureMiddleware from './configureMiddleware';

const configureStore = ({initialState}) => {
  const reducer = configureReducer({initialState});

  const deps = configureDeps({});

  const middleware = configureMiddleware({initialState, deps});

  const enhancers = [applyMiddleware(...middleware)];

  if (global.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(global.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(reducer, initialState);

  return store;
};

export default configureStore;
