import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView as RnScrollView} from 'react-native';

class ScrollView extends Component {
  render() {
    const {children, ...props} = this.props;
    return (
      <RnScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ref={(scroll) => {
          this.scroll = scroll;
        }}
        {...props}>
        {children}
      </RnScrollView>
    );
  }

  scrollTo = ({x, y, animated}) => {
    this.scroll && this.scroll.scrollTo({x, y, animated});
  };

  scrollToEnd = ({animated}) => {
    this.scroll && this.scroll.scrollToEnd({animated});
  };
}

ScrollView.propTypes = {
  children: PropTypes.node,
};

export default ScrollView;
