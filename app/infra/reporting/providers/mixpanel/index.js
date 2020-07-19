import mixpanel from 'react-native-mixpanel';
import config from '/config';
import { Logger } from '/infra/reporting';

const { token, fireEvents } = config.providers.mixpanel;

const stateTypes = {
  INITIALIZING: 1,
  NOT_SET: 2,
  INITIALIZED: 3
};
let initializingPromise;
let state = stateTypes.NOT_SET;

if (fireEvents) {
  state = stateTypes.INITIALIZING;
  initializingPromise = mixpanel
    .sharedInstanceWithToken(token)
    .then(() => {
      state = stateTypes.INITIALIZED;
    })
    .catch((err) => {
      state = stateTypes.NOT_SET;
      Logger.error(`Failed to initialize Mixpanel, ${err}`);
    });
}

// Mixpanel changed 'sharedInstanceWithToken' to be async, so we need to defer all calls until it is resolved
// Instead of changing all the calls, we manage it in one place using with a Proxy
const mixpanelProxy = new Proxy(
  {},
  {
    get: (target, api) => async (...args) => {
      if (state === stateTypes.INITIALIZING) {
        await initializingPromise;
      }
      if (state === stateTypes.INITIALIZED) {
        return mixpanel[api](...args);
      }
      return null;
    }
  }
);

export default mixpanelProxy;
