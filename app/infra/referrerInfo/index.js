import branch from 'react-native-branch';
import {Logger} from '../reporting';
import {isEmpty} from '../utils';
import {isAndroid} from '../utils/deviceUtils';

let subscribed = false;
let subscribePromise;
let firstSubscribeParams;

export const branchSubscribePromise = (cb) => {
  if (!subscribePromise) {
    subscribePromise = new Promise((resolve) => {
      branch.initSessionTtl = 20000;
      branch.subscribe(({error, params}) => {
        if (!error) {
          subscribed = true;
        }
        cb && cb({error, params});
        if (!firstSubscribeParams && params && params['+is_first_session']) {
          firstSubscribeParams = params;
        }
        resolve();
      });
    });
  }

  return subscribePromise;
};

export const getFirstReferringParams = async () =>
  new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      Logger.debug('Branch getFirstReferringParams timed out');
      resolve({error: 'timeout'});
    }, 6000);

    if (!subscribed) {
      await branchSubscribePromise();
    }
    const result = await branch.getFirstReferringParams();
    clearTimeout(timeout);
    if (isAndroid && isEmpty(result) && !isEmpty(firstSubscribeParams)) {
      resolve(firstSubscribeParams);
    } else {
      resolve(result);
    }
  });
