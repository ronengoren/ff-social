import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorGoBack = ({onRefresh}) => (
  <ErrorScreen
    onRefresh={onRefresh}
    icon="back-arrow"
    title={I18n.t('error_boundaries.go_back.title')}
    content={I18n.t('error_boundaries.go_back.body')}
  />
);

ErrorGoBack.propTypes = {
  onRefresh: PropTypes.func,
};

export default ErrorGoBack;
