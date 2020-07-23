import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {NewTextButton} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    borderWidth: 0,
  },
  buttonText: {
    color: flipFlopColors.azure,
    fontSize: 16,
  },
  buttonIcon: {
    color: flipFlopColors.azure,
  },
});

class EntityActionButton extends Component {
  render() {
    const {style, text, iconName, ...rest} = this.props;

    return (
      <NewTextButton
        style={[styles.button, style]}
        textStyle={styles.buttonText}
        size={NewTextButton.sizes.BIG55}
        iconName={iconName}
        iconSize={18}
        iconWeight="solid"
        iconStyle={styles.buttonIcon}
        withShadow
        {...rest}>
        {text}
      </NewTextButton>
    );
  }
}

EntityActionButton.defaultProps = {
  iconName: 'plus-circle',
};

EntityActionButton.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
};

export default EntityActionButton;
