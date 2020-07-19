import {Component} from 'react';
import PropTypes from 'prop-types';
// import { ErrorsLogger } from '/infra/reporting';

class ItemErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  render() {
    const {children} = this.props;

    if (this.state.hasError) {
      return null;
    }

    return children;
  }

  componentDidCatch(error) {
    const {boundaryName} = this.props;

    this.setState({hasError: true});
    // ErrorsLogger.boundaryError(boundaryName, error);
  }
}

ItemErrorBoundary.propTypes = {
  boundaryName: PropTypes.string,
  children: PropTypes.node,
};

export default ItemErrorBoundary;
