import {Platform} from 'react-native';
import {LoginManager} from 'react-native-fbsdk';

export {AccessToken} from 'react-native-fbsdk';

const fbLoginBehaviour = Platform.select({
  ios: 'native',
  android: 'native_with_fallback',
});

export const facebookLogin = async (permissions) => {
  LoginManager.setLoginBehavior(fbLoginBehaviour);
  LoginManager.logOut(); // facebook is storing session in cache, this fixes an issue with dangling sessions.
  const result = await LoginManager.logInWithPermissions(permissions);
  return result;
};
