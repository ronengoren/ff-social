import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TextButton} from './basicComponents';

const ApiCommandTextButton = ({
  command,
  children,
  apiCommands,
  busy,
  ...props
}) => {
  const apiCommand = apiCommands[command];
  return (
    <TextButton
      busy={busy || (apiCommand && apiCommand === 'processing')}
      {...props}>
      {children}
    </TextButton>
  );
};

ApiCommandTextButton.propTypes = {
  command: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  apiCommands: PropTypes.object,
  busy: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  apiCommands: state.apiCommands,
});

export default connect(mapStateToProps)(ApiCommandTextButton);
