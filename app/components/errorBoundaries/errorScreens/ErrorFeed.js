import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../../../infra/localization';
import ErrorScreen from './ErrorScreen';

const ErrorFeed = ({onRefresh}) => (
  <ErrorScreen
    onRefresh={onRefresh}
    icon="retry"
    title={I18n.t('error_boundaries.feed.title')}
    content={I18n.t('error_boundaries.feed.body')}
  />
);

ErrorFeed.propTypes = {
  onRefresh: PropTypes.func,
};

export default ErrorFeed;
