import {ErrorsLogger} from '../../infra/reporting';

export const API_COMMAND_REQUEST = 'API_COMMAND_REQUEST';
export const API_COMMAND_SUCCESS = 'API_COMMAND_SUCCESS';
export const API_COMMAND_FAILURE = 'API_COMMAND_FAILURE';

export const apiCommand = (command, params) => (
  dispatch,
  getState,
  {apiCommands},
) => {
  const [domain, key] = command.split('.');
  const request = apiCommands[domain][key];

  dispatch({type: API_COMMAND_REQUEST, payload: {command, params}});

  return new Promise((resolve, reject) => {
    request(params)
      .then((res) => {
        dispatch({type: API_COMMAND_SUCCESS, payload: {command, res}});
        resolve(res);
      })
      .catch((err) => {
        dispatch({type: API_COMMAND_FAILURE, payload: {command, err}});
        ErrorsLogger.apiCommandError(
          {command, params},
          err.toString(),
          err.response,
        );
        reject(err);
      });
  });
};
