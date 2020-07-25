import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorDefault = ({onRefresh}) => (
  <ErrorScreen
    onRefresh={onRefresh}
    icon="retry"
    title={I18n.t('error_boundaries.default.title')}
    content={I18n.t('error_boundaries.default.body')}
  />
);

ErrorDefault.propTypes = {
  onRefresh: PropTypes.func,
};

export default ErrorDefault;
