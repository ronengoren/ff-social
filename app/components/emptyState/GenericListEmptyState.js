import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {uiDefinitions} from '../../vars/enums';
import {stylesScheme} from '../../schemas';
import {flipFlopColors} from '../../vars';
import GenericEmptyState from './GenericEmptyState';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
});

class GenericListEmptyState extends React.Component {
  render() {
    const {type, headerText, bodyText, style} = this.props;
    const {isHomeisIcon, name} = uiDefinitions[type];
    return (
      <GenericEmptyState
        isHomeisIcon={isHomeisIcon}
        iconName={name}
        headerText={headerText}
        bodyText={bodyText}
        style={[style, styles.container]}
      />
    );
  }
}

GenericListEmptyState.propTypes = {
  type: PropTypes.string,
  headerText: PropTypes.string,
  bodyText: PropTypes.string,
  style: stylesScheme,
};

export default GenericListEmptyState;
