import React from 'react';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorPageNotFound = () => (
  <ErrorScreen
    icon="compass"
    title={I18n.t('error_boundaries.not_found.title')}
    content={I18n.t('error_boundaries.not_found.body')}
  />
);

export default ErrorPageNotFound;
