import thunk from 'redux-thunk';
import {catchErrorsMiddleware} from './middleware';

const configureMiddleware = ({deps}) => {
  const middleware = [thunk.withExtraArgument(deps), catchErrorsMiddleware];

  return middleware;
};

export default configureMiddleware;
