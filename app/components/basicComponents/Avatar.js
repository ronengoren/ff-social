/* eslint-disable react-native/no-unused-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {View, Text, Image} from '../../components/basicComponents';
import {
  entityTypes,
  screenNamesByEntityType,
  entityIconAndColorByEntityType,
  avatarBadgePosition,
} from '../../vars/enums';
import {flipFlopColors, uiConstants} from '../../vars';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {getInitials} from '../../infra/utils/stringUtils';
import {stylesScheme} from '../../schemas';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  extraTiny: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: flipFlopColors.white,
  },
  extraTinyText: {
    fontSize: 8,
    lineHeight: 12,
  },
  tiny: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  tinyText: {
    fontSize: 10,
    lineHeight: 14,
  },
  small: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  small1: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  smallText: {
    fontSize: 14,
  },
  medium1: {
    width: 35,
    height: 35,
    borderRadius: 30,
  },
  medium: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  mediumText: {
    fontSize: 14,
  },
  medium1Text: {
    fontSize: 14,
  },
  medium2: {
    width: 55,
    height: 55,
    borderRadius: 40,
  },
  medium2Text: {
    fontSize: 16,
  },
  large: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  large1: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  largeText: {
    fontSize: 16,
  },
  large1Text: {
    height: 33,
    fontSize: 30,
    lineHeight: 35,
  },
  big: {
    width: 70,
    height: 70,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  big1: {
    width: 55,
    height: 55,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: flipFlopColors.b95,
  },
  bigRounded: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  bigText: {
    fontSize: 20,
  },
  extraBig: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  extraBigText: {
    fontSize: 20,
  },
  huge: {
    width: 90,
    height: 90,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  extraLarge: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGrey,
  },
  extraLargeText: {
    height: 33,
    fontSize: 40,
    lineHeight: 40,
  },
  initialsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: flipFlopColors.white,
  },
  badgeWrapper: {
    position: 'absolute',
    width: 15,
    height: 15,
    backgroundColor: flipFlopColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyBadgeWrapper: {
    width: 10,
    height: 10,
    borderRadius: 4,
    right: -5,
    top: -2,
  },
  tinyBottomBadgeWrapper: {
    top: 19,
  },
  smallBadgeWrapper: {
    width: 10,
    height: 10,
    borderRadius: 4,
    right: -5,
    top: -2,
  },
  smallBottomBadgeWrapper: {
    top: 24,
  },
  mediumBadgeWrapper: {
    width: 12,
    height: 12,
    borderRadius: 5,
    right: -6,
    top: -2,
  },
  mediumBottomBadgeWrapper: {
    top: 33,
  },
  medium2BottomBadgeWrapper: {
    bottom: 0,
    right: 0,
    borderRadius: 20,
  },
  largeBadgeWrapper: {
    width: 16,
    height: 16,
    borderRadius: 7,
    right: -8,
    top: -2,
  },
  largeBottomBadgeWrapper: {
    top: 51,
  },
  bigBadgeWrapper: {
    width: 20,
    height: 20,
    borderRadius: 9,
    right: -10,
    top: -3,
  },
  bigBottomBadgeWrapper: {
    top: 59,
  },
  hugeBadgeWrapper: {
    width: 31,
    height: 31,
    borderRadius: 14,
    right: -15,
    top: -3,
  },
  hugeBottomBadgeWrapper: {
    top: 74,
  },
  tinyComplexBadgeWrapper: {
    left: 17,
    top: 16,
    padding: 2,
    height: 19,
    width: 19,
    borderRadius: 7,
  },
  tinyComplexBottomBadgeWrapper: {
    top: 16,
  },
  smallComplexBadgeWrapper: {
    left: 17,
    top: 16,
    padding: 2,
    height: 19,
    width: 19,
    borderRadius: 7,
  },
  smallComplexBottomBadgeWrapper: {
    top: 16,
  },
  mediumComplexBadgeWrapper: {
    left: 28,
    top: 22,
    padding: 2,
    height: 21,
    width: 21,
    borderRadius: 8,
  },
  mediumComplexBottomBadgeWrapper: {
    top: 16,
  },
  medium2ComplexBadgeWrapper: {
    top: 0,
    right: 0,
    borderRadius: 20,
    width: 25,
    height: 25,
  },
  medium2BottomComplexBadgeWrapper: {
    top: 40,
  },
  hugeComplexBadgeWrapper: {
    left: 28,
    top: 22,
    padding: 2,
    height: 21,
    width: 21,
    borderRadius: 8,
  },
  hugeBottomComplexBadgeWrapper: {
    top: 20,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyBadge: {
    width: 6,
    height: 6,
    borderRadius: 2,
  },
  smallBadge: {
    width: 6,
    height: 6,
    borderRadius: 2,
  },
  mediumBadge: {
    width: 8,
    height: 8,
    borderRadius: 3,
  },
  medium2Badge: {
    width: 14,
    height: 14,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: flipFlopColors.white,
  },
  largeBadge: {
    width: 12,
    height: 12,
    borderRadius: 5,
  },
  bigBadge: {
    width: 14,
    height: 14,
    borderRadius: 6,
  },
  hugeBadge: {
    width: 25,
    height: 25,
    borderRadius: 11,
  },
  extraLargeBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  tinyComplexBadge: {
    height: 15,
    width: 15,
    borderRadius: 7,
  },
  smallComplexBadge: {
    height: 15,
    width: 15,
    borderRadius: 7,
  },
  mediumComplexBadge: {
    height: 17,
    width: 17,
    borderRadius: 9,
  },
  medium2ComplexBadge: {
    height: 25,
    width: 25,
    borderRadius: 20,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    elevation: 4,
  },
  largeComplexBadge: {
    height: 17,
    width: 17,
    borderRadius: 9,
  },
  bigComplexBadge: {
    height: 17,
    width: 17,
    borderRadius: 9,
  },
  hugeComplexBadge: {
    height: 17,
    width: 17,
    borderRadius: 9,
  },
  extraLargeComplexBadge: {
    height: 40,
    width: 40,
    borderRadius: 12,
  },
  badgeIcon: {
    marginTop: -1,
  },
  iconText: {
    fontSize: 12,
    color: flipFlopColors.white,
  },
});

const iconFontSize = {
  tiny: 20,
  small: 25,
  medium: 35,
  large: 55,
  big: 65,
  extraBig: 75,
  huge: 85,
  extraLarge: 80,
};

const awesomeIconFontSize = {
  large: 30,
  big: 30,
};

export class Avatar extends Component {
  render() {
    const {style, linkable, hitSlop, testID, onPress, onLongPress} = this.props;

    if (linkable) {
      return (
        <TouchableOpacity
          testID={testID}
          onLongPress={onLongPress}
          onPress={this.navigateToWrapper}
          activeOpacity={1}
          style={style}
          hitSlop={hitSlop}>
          {this.renderContent()}
          {this.renderBadge()}
        </TouchableOpacity>
      );
    }

    return (
      <View style={style} testID={testID}>
        {this.renderContent()}
        {this.renderBadge()}
      </View>
    );
  }

  renderContent() {
    const {thumbnail, entityType, name} = this.props;

    if (thumbnail) {
      return this.renderImage();
    }

    if (entityType === entityTypes.USER && name) {
      return this.renderInitials();
    }

    return this.renderPlaceholder();
  }

  renderPlaceholder() {
    const {size, entityType, imageStyle} = this.props;
    const wrapperStyle = [
      styles[size],
      styles.initialsWrapper,
      {backgroundColor: flipFlopColors.paleGreyTwo},
    ];
    const {entityIcon, isAwesomeIcon} = entityIconAndColorByEntityType[
      entityType
    ];

    return (
      <View style={[wrapperStyle, imageStyle]}>
        {isAwesomeIcon ? (
          <AwesomeIcon
            name={entityIcon}
            weight="solid"
            color={flipFlopColors.b90}
            size={awesomeIconFontSize[size] || 30}
          />
        ) : (
          <HomeisIcon
            name={entityIcon}
            color={flipFlopColors.b90}
            size={iconFontSize[size] || 30}
          />
        )}
      </View>
    );
  }

  renderImage() {
    const {size, thumbnail, imageStyle} = this.props;

    return (
      <Image source={{uri: thumbnail}} style={[styles[size], imageStyle]} />
    );
  }

  renderInitials() {
    const {size, name, themeColor, imageStyle, withInitials} = this.props;
    const initials = getInitials(name);
    return (
      <View
        style={[
          styles[size],
          styles.initialsWrapper,
          {
            backgroundColor: themeColor
              ? `#${themeColor}`
              : flipFlopColors.disabledGrey,
          },
          imageStyle,
        ]}>
        {withInitials && (
          <Text style={[styles[`${size}Text`], styles.initialsText]}>
            {initials}
          </Text>
        )}
      </View>
    );
  }

  renderBadge() {
    const {
      showBadge,
      badgePosition,
      iconName,
      iconText,
      size,
      badgeColor,
    } = this.props;

    if (!showBadge || Platform.OS === 'android') {
      // android doesn't support element overflow yet
      return null;
    }
    const badgeWrapperStylePostfix =
      iconName || iconText ? 'ComplexBadgeWrapper' : 'BadgeWrapper';
    const badgeWrapperStyle = [
      styles.badgeWrapper,
      styles[`${size}${badgeWrapperStylePostfix}`],
      badgePosition === avatarBadgePosition.BOTTOM &&
        styles[`${size}Bottom${badgeWrapperStylePostfix}`],
    ];
    const badgeStyle = [
      styles.badge,
      iconName || iconText
        ? styles[`${size}ComplexBadge`]
        : styles[`${size}Badge`],
      {backgroundColor: badgeColor, shadowColor: badgeColor},
    ];

    return (
      <View style={badgeWrapperStyle}>
        <View style={badgeStyle}>
          {(iconName || iconText) && this.renderBadgeIcon()}
        </View>
      </View>
    );
  }

  renderBadgeIcon() {
    const {
      badgeColor,
      iconName,
      isAwesomeIcon,
      iconText,
      iconSize,
    } = this.props;

    if (iconName) {
      if (isAwesomeIcon) {
        return (
          <AwesomeIcon
            style={[styles.badgeIcon, {backgroundColor: badgeColor}]}
            name={iconName}
            color={flipFlopColors.white}
            size={iconSize}
            weight="solid"
          />
        );
      }
      return (
        <HomeisIcon
          style={[styles.badgeIcon, {backgroundColor: badgeColor}]}
          name={iconName}
          color={flipFlopColors.white}
          size={iconSize}
        />
      );
    }

    if (iconText) {
      return <Text style={styles.iconText}>{iconText}</Text>;
    }

    return null;
  }

  navigateToWrapper = () => {
    navigationService.navigateToProfile();

    // const {entityType, entityId, name, themeColor, thumbnail} = this.props;
    // const params = {entityId, data: {name, themeColor, thumbnail}};
    // if (entityType === entityTypes.USER) {
    //   navigationService.navigateToProfile(params);
    // } else {
    //   navigationService.navigate(screenNamesByEntityType[entityType], params);
    // }
  };
}

Avatar.defaultProps = {
  size: 'medium',
  entityType: entityTypes.USER,
  themeColor: flipFlopColors.disabledGrey.slice(1), // hex color without the '#'
  name: '',
  linkable: true,
  badgePosition: avatarBadgePosition.TOP,
  iconSize: 12,
  hitSlop: uiConstants.BTN_HITSLOP,
  withInitials: true,
};

Avatar.propTypes = {
  thumbnail: PropTypes.string,
  size: PropTypes.oneOf([
    'extraTiny',
    'tiny',
    'small',
    'small1',
    'medium',
    'medium1',
    'medium2',
    'large',
    'large1',
    'big',
    'big1',
    'extraBig',
    'bigRounded',
    'huge',
    'extraLarge',
  ]),
  name: PropTypes.string,
  themeColor: PropTypes.string,
  testID: PropTypes.string,
  entityType: PropTypes.string,
  entityId: PropTypes.string,
  style: stylesScheme,
  imageStyle: stylesScheme,
  showBadge: PropTypes.bool,
  badgePosition: PropTypes.string,
  iconName: PropTypes.string,
  iconText: PropTypes.string,
  badgeColor: PropTypes.string,
  iconSize: PropTypes.number,
  linkable: PropTypes.bool,
  hitSlop: PropTypes.object,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  withInitials: PropTypes.bool,
  isAwesomeIcon: PropTypes.bool,
};

export default Avatar;
