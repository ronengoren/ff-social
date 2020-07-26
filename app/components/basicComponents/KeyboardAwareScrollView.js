import React from 'react';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class KeyboardAwareScrollViewWrapper extends React.Component {
  render() {
    const {children, ...props} = this.props;
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        ref={(scroll) => {
          this.scroll = scroll;
        }}
        {...props}>
        {children}
      </KeyboardAwareScrollView>
    );
  }

  scrollToPosition = (x, y, animated) => {
    this.scroll.scrollToPosition(x, y, animated);
  };
}

KeyboardAwareScrollViewWrapper.propTypes = {
  children: PropTypes.node,
};

export default KeyboardAwareScrollViewWrapper;
