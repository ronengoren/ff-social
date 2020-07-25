import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorConnection = ({onRefresh}) => (
  <ErrorScreen
    onRefresh={onRefresh}
    icon="retry"
    title={I18n.t('error_boundaries.connection.title')}
    content={I18n.t('error_boundaries.connection.body')}
  />
);

ErrorConnection.propTypes = {
  onRefresh: PropTypes.func,
};

export default ErrorConnection;
