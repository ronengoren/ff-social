import React, {Component} from 'react';
import HTML from 'react-native-render-html';

import PropTypes from 'prop-types';
import {Text} from '../basicComponents';

class HTMLView extends Component {
  render() {
    const {wrapperProps, customWrapper, ...restProps} = this.props;

    return (
      <HTML
        customWrapper={
          customWrapper ||
          ((children) => (
            <Text allowFontScaling={false} alignLocale {...wrapperProps}>
              {children}
            </Text>
          ))
        }
        {...restProps}
      />
    );
  }
}

HTMLView.defaultProps = {
  wrapperProps: {numberOfLines: 1},
};

HTMLView.propTypes = {
  customWrapper: PropTypes.func,
  wrapperProps: PropTypes.object,
};

export default HTMLView;
