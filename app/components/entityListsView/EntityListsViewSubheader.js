import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';
import {isHebrewOrArabic} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftTextWrapper: {
    flexDirection: 'row',
  },
  badge: {
    alignItems: 'center',
    width: 20,
    height: 20,
    marginLeft: 7,
    borderRadius: 10,
  },
  rightButton: {
    flexDirection: 'row',
  },
  leftButtonIcon: {
    marginLeft: 6,
    lineHeight: 21,
  },
});

class EntityListsViewSubheader extends Component {
  render() {
    const {
      leftText,
      badge,
      badgeColor,
      rightButtonText,
      rightButtonTextSize,
      rightButtonAction,
      rightButtonColor,
      rightButtonIconName,
      rightButtonIconSize,
      rightButtonTestId,
      style,
      rightButtonStyle,
      rightButtonTextStyle,
    } = this.props;

    const isHebrewText = isHebrewOrArabic(leftText);
    return (
      <View style={[styles.wrapper, style]}>
        <View style={styles.leftTextWrapper}>
          <Text
            size={isHebrewText ? 18 : 16}
            lineHeight={21}
            color={flipFlopColors.b30}
            bold>
            {leftText}
          </Text>
          {!!badge && (
            <View style={[styles.badge, {backgroundColor: badgeColor}]}>
              <Text size={12} lineHeight={19} color={flipFlopColors.white} bold>
                {badge}
              </Text>
            </View>
          )}
        </View>
        {!!(rightButtonText || rightButtonIconName) && (
          <TouchableOpacity
            onPress={rightButtonAction}
            style={[styles.rightButton, rightButtonStyle]}
            activeOpacity={1}
            testID={rightButtonTestId}>
            {!!rightButtonText && (
              <Text
                size={rightButtonTextSize}
                lineHeight={21}
                color={rightButtonColor}
                style={rightButtonTextStyle}>
                {rightButtonText}
              </Text>
            )}
            {!!rightButtonIconName && (
              <AwesomeIcon
                name={rightButtonIconName}
                color={rightButtonColor}
                size={rightButtonIconSize}
                weight="solid"
                style={styles.leftButtonIcon}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

EntityListsViewSubheader.defaultProps = {
  rightButtonTextSize: 16,
};

EntityListsViewSubheader.propTypes = {
  leftText: PropTypes.string,
  badge: PropTypes.number,
  badgeColor: PropTypes.string,
  rightButtonText: PropTypes.string,
  rightButtonTextSize: PropTypes.number,
  rightButtonAction: PropTypes.func,
  rightButtonColor: PropTypes.string,
  rightButtonIconName: PropTypes.string,
  rightButtonIconSize: PropTypes.number,
  rightButtonTestId: PropTypes.string,
  style: stylesScheme,
  rightButtonStyle: stylesScheme,
  rightButtonTextStyle: stylesScheme,
};

export default EntityListsViewSubheader;
