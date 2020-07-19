import {user as userLocalStorage} from '../../infra/localStorage';
import {
  getDeviceInfo,
  getVersionNumber,
  getVersionBuildNumber,
} from '../../infra/utils/deviceUtils';
import {logentries} from './providers';

const levelTypes = {
  EXCEPTION: 'exception',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  static exception(msg) {
    Logger.log({level: levelTypes.EXCEPTION, msg});
  }

  static error(msg) {
    Logger.log({level: levelTypes.ERROR, msg});
  }

  static warn(msg) {
    Logger.log({level: levelTypes.WARN, msg});
  }

  static info(msg) {
    Logger.log({level: levelTypes.INFO, msg});
  }

  static debug(msg) {
    Logger.log({level: levelTypes.DEBUG, msg});
  }

  static async log({level, msg}) {
    const user = (await userLocalStorage.get()) || {};
    const versionNumber = getVersionNumber();
    const buildNumber = getVersionBuildNumber();
    const deviceInfo = getDeviceInfo();

    logentries.log({
      level,
      version: {app: versionNumber, build: buildNumber},
      user: {id: user.id, name: user.name},
      deviceInfo: {
        deviceBrand: deviceInfo.getBrand(),
        deviceModel: deviceInfo.getModel(),
        deviceOS: deviceInfo.getSystemName(),
        deviceOsVersion: deviceInfo.getSystemVersion(),
      },
      message: msg,
    });
  }
}

export default Logger;
