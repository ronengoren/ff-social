import React from 'react';
import PropTypes from 'prop-types';
import {Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {getTimezoneSignature} from '../../infra/utils/dateTimeUtils';

class LocalTimeOffsetIndicator extends React.Component {
  render() {
    const {
      size,
      lineHeight,
      color,
      prefix,
      suffix,
      withoutSpacing,
      ...props
    } = this.props;
    return (
      <Text size={size} lineHeight={lineHeight} color={color} {...props}>
        {!withoutSpacing && ' '}
        {`${prefix}${getTimezoneSignature()}${suffix}`}
        {!withoutSpacing && ' '}
      </Text>
    );
  }
}

LocalTimeOffsetIndicator.defaultProps = {
  size: 13,
  lineHeight: 26,
  color: flipFlopColors.b60,
  prefix: '',
  suffix: '',
  withoutSpacing: false,
};

LocalTimeOffsetIndicator.propTypes = {
  withoutSpacing: PropTypes.bool,
  size: PropTypes.number,
  lineHeight: PropTypes.number,
  color: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};

export default LocalTimeOffsetIndicator;
