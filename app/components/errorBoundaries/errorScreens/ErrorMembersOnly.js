import React from 'react';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorMembersOnly = () => (
  <ErrorScreen
    icon="block"
    title={I18n.t('error_boundaries.members_only.title')}
    content={I18n.t('error_boundaries.members_only.body')}
  />
);

export default ErrorMembersOnly;
