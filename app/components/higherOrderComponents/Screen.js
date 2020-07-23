import React from 'react';
import PropTypes from 'prop-types';
import {boundaryNames} from '../../vars/enums';
import hoistStatics from 'hoist-non-react-statics';
import {ScreenErrorBoundary} from '../../components';

const Screen = ({modalError} = {}) => (WrappedComponent) =>
  hoistStatics(
    ({...props}) => (
      <ScreenErrorBoundary
        boundaryName={modalError ? boundaryNames.MODAL : null}>
        <WrappedComponent {...props} />
      </ScreenErrorBoundary>
    ),
    WrappedComponent,
  );

Screen.propTypes = {
  statusBarMode: PropTypes.number,
  modalError: PropTypes.bool,
  WrappedComponent: PropTypes.node,
};

export default Screen;
