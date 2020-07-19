import React from 'react';
import {Provider} from 'react-redux';
import bootstrap from './infra/bootstrap';
import createStore from './redux/createStore';

import App from './App';
bootstrap();

const store = createStore();

global.store = store; // to access the store outside of react components

const Rooti = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Rooti;
