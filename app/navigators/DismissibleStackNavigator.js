import React from 'react';
import PropTypes from 'prop-types';
import {createStackNavigator} from 'react-navigation-stack';

const DismissibleStackNavigator = (routes, options) => {
  const StackNav = createStackNavigator(routes, options);

  class DismissibleStackNav extends React.Component {
    static router = StackNav.router;

    render() {
      const {state, goBack} = this.props.navigation;
      const props = {
        ...this.props.screenProps,
        dismiss: () => goBack(state.key),
      };
      return (
        <StackNav navigation={this.props.navigation} screenProps={props} />
      );
    }
  }

  DismissibleStackNav.propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
  };

  return DismissibleStackNav;
};

export default DismissibleStackNavigator;
