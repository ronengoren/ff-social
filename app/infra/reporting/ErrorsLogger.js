import {get, cloneDeep} from '../utils';
import StackTrace from 'stacktrace-js';
import {reduce} from 'lodash';
// import Logger from './Logger';

// strongly-typed errors

const obfuscatedPassword = '********';

function obfuscateApiCommand(command) {
  if (command.params && command.params.password) {
    const commandClone = cloneDeep(command);
    commandClone.params.password = obfuscatedPassword;
    return commandClone;
  } else {
    return command;
  }
}

function obfuscateResponseObject(responseObject) {
  const data = get(responseObject, 'config.data', null);
  if (data) {
    const parsedData = JSON.parse(data);
    if (parsedData.password) {
      parsedData.password = obfuscatedPassword;
      responseObject.config.data = JSON.stringify(parsedData); // eslint-disable-line no-param-reassign
    }
  }

  return responseObject;
}

class ErrorsLogger {
  static apiCommandError(command, responseMessage, responseObject) {
    console.error({
      errType: 'apiCommandError',
      err: {
        command: obfuscateApiCommand(command),
        responseMessage,
        responseObject: obfuscateResponseObject(responseObject),
      },
    });
  }

  static apiQueryError(query, responseMessage, responseObject) {
    console.error({
      errType: 'apiQueryError',
      err: {query, responseMessage, responseObject},
    });
  }

  static fbSignInError(err) {
    console.error({errType: 'fbSignInError', err});
  }

  static appleSignInError(err) {
    console.error({errType: 'appleSignInError', err});
  }

  static reduxError(err, action) {
    console.error({errType: 'reduxError', err: err.message, action});
  }

  static boundaryError(boundaryName, error) {
    StackTrace.fromError(error, {offline: true}).then((x) => {
      const errSource = reduce(
        x,
        (string, row) => `${string} - ${row.functionName}`,
      );
      console.error({errType: 'boundaryError', error, errSource, boundaryName});
    });
  }

  static nativeDataTimePickerError(code, msg) {
    console.error({errType: 'nativeDataTimePickerError', code, msg});
  }
}

export default ErrorsLogger;
