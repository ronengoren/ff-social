import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RnVideo from 'react-native-video';

class Video extends Component {
  render() {
    const {onRef, source, ...otherProps} = this.props;

    if (
      !source ||
      (typeof source.uri === 'string' && !source.uri.trim().length)
    ) {
      return null;
    }

    return <RnVideo source={source} ref={onRef} {...otherProps} />;
  }
}

Video.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.node,
  ]),
  onRef: PropTypes.func,
};

export default Video;
