import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {get, isEmpty} from '../../infra/utils';
import {showSnackbar, hideSnackbar} from '../../redux/general/actions';
import snackbarComponents from '../snackbars/enums';

class Snackbar extends Component {
  render() {
    const {snackbars} = this.props;
    if (!isEmpty(snackbars)) {
      const content = Object.keys(snackbars).map(this.renderSnackbar);
      return React.Children.toArray(content);
    }
    return null;
  }

  renderSnackbar = (snackbarType) => {
    const {snackbars, showSnackbar, hideSnackbar} = this.props;
    const {isVisible, componentProps = {}} = snackbars[snackbarType];
    const SnackbarComponent = snackbarComponents[snackbarType];
    return (
      <SnackbarComponent
        isVisible={isVisible}
        showCurrentSnackbar={() => showSnackbar({snackbarType})}
        hideCurrentSnackbar={() => hideSnackbar({snackbarType})}
        {...componentProps}
      />
    );
  };
}

const mapStateToProps = (state) => ({
  snackbars: get(state, 'general.snackbars'),
});

const mapDispatchToProps = {
  showSnackbar,
  hideSnackbar,
};

Snackbar.propTypes = {
  snackbars: PropTypes.object,
  hideSnackbar: PropTypes.func,
  showSnackbar: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
