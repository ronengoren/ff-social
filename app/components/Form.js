import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initialState;
  }

  render() {
    const {onSubmit} = this.props;
    const form = {
      state: this.state,
      onChange: this.handleChange,
      onReset: this.handleReset,
      onSubmit: () => onSubmit(this.state),
    };

    return this.props.children(form);
  }

  handleChange = (state) => {
    this.setState(state);
  };

  handleReset = () => {
    const resetState = {};
    Object.keys(this.state).forEach((key) => {
      resetState[key] = undefined;
    });
    this.setState(resetState);
  };
}

Form.defaultProps = {
  initialState: {},
};

Form.propTypes = {
  initialState: PropTypes.object,
  onSubmit: PropTypes.func,
  children: PropTypes.func,
};

export default Form;
