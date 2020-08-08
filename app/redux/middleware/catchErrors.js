import ErrorsLogger from '../../infra/reporting/ErrorsLogger';

const errorHandlingMiddleware = () => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    if (global.__DEV__) {
      console.error(err);
    }
    ErrorsLogger.reduxError(err, action);
    return err;
  }
};

export default errorHandlingMiddleware;
