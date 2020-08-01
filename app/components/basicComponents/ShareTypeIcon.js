import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {flipFlopColors} from '../../vars';
import {FlipFlopIcon, AwesomeIcon} from '../../assets/icons';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: flipFlopColors.transparent,
    borderRadius: 35,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ShareTypeIcon extends Component {
  render() {
    const {
      onPress,
      testID,
      iconName,
      iconSize,
      iconStyle,
      iconWeight,
      color,
      style,
      isAwesomeIcon,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={[styles.container, style]}
        testID={testID}>
        {isAwesomeIcon ? (
          <AwesomeIcon
            name={iconName}
            size={iconSize}
            weight={iconWeight}
            color={color || flipFlopColors.black}
            style={iconStyle}
          />
        ) : (
          <FlipFlopIcon
            name={iconName}
            size={iconSize}
            color={color || flipFlopColors.black}
            style={iconStyle}
          />
        )}
      </TouchableOpacity>
    );
  }
}

ShareTypeIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  iconWeight: PropTypes.string,
  iconStyle: stylesScheme,
  style: stylesScheme,
  color: PropTypes.string,
  isAwesomeIcon: PropTypes.bool,
  testID: PropTypes.string,
};

export default ShareTypeIcon;
