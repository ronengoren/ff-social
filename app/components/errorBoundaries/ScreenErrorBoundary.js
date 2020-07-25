import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import { ErrorsLogger } from '/infra/reporting';
import {navigationService} from '../../infra/navigation';
import {connect} from 'react-redux';
import {boundaryNames} from '../../vars/enums';
// import { logout } from '/redux/auth/actions';
import {get} from '../../infra/utils';
import {
  ErrorConnection,
  ErrorDefault,
  ErrorFeed,
  ErrorMembersOnly,
  ErrorPageNotFound,
  ErrorGoBack,
} from './errorScreens';

const initialState = {
  hasError: false,
  error: null,
};

class ScreenErrorBoundary extends Component {
  state = initialState;

  render() {
    const {boundaryName, logout, children} = this.props;
    const {error, hasError} = this.state;

    if (hasError) {
      if (
        get(error, 'response.status') === 401 ||
        error.message.includes('Unauthenticated')
      ) {
        logout({});
      } else if (boundaryName === boundaryNames.MODAL) {
        // In case we are in a modal with no header/footer to navigate
        return <ErrorGoBack onRefresh={this.handleGoBack} />;
      } else if (boundaryName === boundaryNames.FEED) {
        return <ErrorFeed onRefresh={this.handleRefresh} />;
      } else if (!error.message) {
        return <ErrorDefault />;
      } else if (error.message.includes('Network Error')) {
        return <ErrorConnection onRefresh={this.handleRefresh} />;
      } else if (
        error.message.includes('500') ||
        error.message.includes('404')
      ) {
        // TODO: check this code
        return <ErrorPageNotFound />;
      }
      if (error.message.includes('403')) {
        return <ErrorMembersOnly />;
      }

      return <ErrorDefault onRefresh={this.handleRefresh} />;
    }

    return children;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError && this.state.hasError) {
      this.resetState();
    }
  }

  componentDidCatch(error) {
    // const { boundaryName } = this.props;
    // this.setState({ hasError: true, error });
    // ErrorsLogger.boundaryError(boundaryName, error);
  }

  handleRefresh = () => {
    this.resetState();
  };

  handleGoBack = () => {
    navigationService.goBack();
  };

  resetState = () => {
    this.setState(initialState);
  };
}

ScreenErrorBoundary.defaultProps = {
  boundaryName: boundaryNames.SCREEN,
};

ScreenErrorBoundary.propTypes = {
  boundaryName: PropTypes.string,
  children: PropTypes.node,
  //   logout: PropTypes.func
};

const mapDispatchToProps = {};

ScreenErrorBoundary = connect(null, mapDispatchToProps)(ScreenErrorBoundary);
export default ScreenErrorBoundary;
