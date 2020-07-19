// import Pushwoosh from 'pushwoosh-react-native-plugin';
import {Platform} from 'react-native';

import config from '../../config';
import {apiCommand} from '../../redux/apiCommands/actions';
import {Logger} from '../reporting';
import {get} from '../utils';
import {getDeviceUUID} from '../utils/deviceUtils';
import {getFirstName} from '../utils/stringUtils';
import {getLastName} from '../utils/stringUtils';

// Pushwoosh.init({
//   pw_appid: config.providers.pushwoosh.appId,
//   project_number: config.providers.pushwoosh.projectNumber,
// });

// export function getPushToken() {
//   return new Promise((resolve, reject) => {
//     Pushwoosh.getPushToken(
//       (token) => {
//         resolve(token);
//       },
//       (err) => {
//         reject(err);
//       },
//     );
//   });
// }

// export async function setUserId(userId) {
//   await Pushwoosh.setUserId(userId);
// }

export async function setUserTags(user) {
  const {name = '', gender} = user;
  const communityId = get(user, 'community.id');
  const neighborhoodName = get(user, 'journey.neighborhood.name');
  const neighborhoodId = get(user, 'journey.neighborhood.id');

  await Pushwoosh.setTags({
    communityId,
    neighborhoodId,
    neighborhoodName,
    firstName: getFirstName(name),
    lastName: getLastName(name),
    gender,
  });
}

// export function configurePushNotificationOptions() {
//   const isAndroid = Platform.OS === 'android';
//   if (isAndroid) {
//     Pushwoosh.setMultiNotificationMode(true);
//     Pushwoosh.setLightScreenOnNotification(true);
//   }
// }

// export function setBadgeNumber(newBadgeNumber) {
//   return new Promise((resolve) => {
//     Pushwoosh.getApplicationIconBadgeNumber((currentBadgeNumber) => {
//       if (currentBadgeNumber !== newBadgeNumber) {
//         Pushwoosh.setApplicationIconBadgeNumber(newBadgeNumber);
//         global.store.dispatch(
//           apiCommand('users.setBadgeNumber', {badgeNumber: newBadgeNumber}),
//         );
//       }
//       resolve();
//     });
//   });
// }

// export async function resetUser() {
//   await setBadgeNumber(0);
//   Pushwoosh.setUserId(getDeviceUUID());
// }

// export function register(user) {
//   return new Promise((resolve) => {
//     const {id} = user;
//     Pushwoosh.register(
//       (token) => {
//         global.store.dispatch(apiCommand('auth.addDeviceToken', {token}));
//         setUserId(id);
//         setUserTags(user);
//         resolve(token);
//       },
//       (err) => {
//         Logger.error({
//           errType: 'pushwoosh',
//           err,
//           action: 'register push notifications',
//         });
//         resolve();
//       },
//     );
//   });
// }

export async function unregisterPushNotifications() {
  const {user} = global.store.getState().auth;

  // return new Promise((resolve, reject) => {
  //   Pushwoosh.unregister(
  //     (response) => {
  //       Logger.info({
  //         domain: 'push',
  //         method: 'unregisterPushNotifications',
  //         case: 'success',
  //         response,
  //         userName: user && user.name,
  //         userId: user && user.id,
  //       });
  //       resolve();
  //     },
  //     (err) => {
  //       Logger.info({
  //         domain: 'push',
  //         method: 'unregisterPushNotifications',
  //         case: 'failure',
  //         err,
  //         userName: user && user.name,
  //         userId: user && user.id,
  //       });
  //       reject(new Error("couldn't unregister device for push notifications"));
  //     },
  //   );
  // });
}
