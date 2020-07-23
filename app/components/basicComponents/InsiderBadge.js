import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AwesomeIcon} from '../../assets/icons';
import {View, Text} from '../basicComponents';
import I18n from '../../infra/localization';
import {flipFlopColors} from '/vars';
import {
  userRoleTypes,
  pageRoleTypes,
  communityRoleTypes,
} from '../../vars/enums';
import {stylesScheme} from '../../schemas/common';
// import { showCommunityRoleModal } from '/redux/general/actions';
// import { analytics } from '/infra/reporting';

function getDefinitions({type, tag, rolePrefix}) {
  const definitionsByType = {
    [userRoleTypes.REGIONAL_MANAGER]: {
      iconName: 'crown',
      text: rolePrefix
        ? I18n.t('badges.regional_manager.title', {prefix: rolePrefix})
        : I18n.t('badges.regional_manager.default_title'),
      bgColor: flipFlopColors.orange,
      communityRoleType: communityRoleTypes.INSIDER,
      supportPress: true,
    },
    [userRoleTypes.NATIONAL_MANAGER]: {
      iconName: 'crown',
      text: I18n.t('badges.national_manager.title'),
      bgColor: flipFlopColors.orange,
      communityRoleType: communityRoleTypes.INSIDER,
    },
    [pageRoleTypes.EXPERT]: {
      iconName: 'badge-check',
      text: I18n.t('badges.expert.title', {
        tag: tag ? I18n.t(`shared.tags.${tag}`) : '',
      }),
      secondaryText: I18n.t('badges.expert.text'),
      bgColor: flipFlopColors.lightIndigo,
      communityRoleType: communityRoleTypes.EXPERT,
      supportPress: true,
    },
  };
  return definitionsByType[type] || {};
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: flipFlopColors.orange,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 13,
    paddingRight: 15,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    elevation: 4,
  },
  wrapperInline: {
    flexDirection: 'row',
  },
  leftAlign: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  rightAlign: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  icon: {
    marginRight: 7,
    marginTop: -1,
  },
  iconInline: {
    borderWidth: 1,
    borderRadius: 10,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    elevation: 4,
    marginTop: 1,
  },
});

function InsiderBadge({
  type,
  tag,
  iconSize,
  iconColor,
  size,
  secondarySize,
  style,
  textStyle,
  iconStyle,
  align,
  inline,
  rolePrefix,
  breakText,
  preventPress,
  originEntity,
}) {
  const dispatch = useDispatch();
  const {
    iconName,
    text,
    bgColor,
    secondaryText,
    communityRoleType,
    supportPress,
  } = useMemo(() => getDefinitions({type, tag, rolePrefix}), [
    type,
    tag,
    rolePrefix,
  ]);

  const onBadgePress = () => {
    // if (supportPress && !preventPress) {
    //   analytics.actionEvents.clickOnBadge({ badgeType: type, expertTag: tag, componentName: originEntity }).dispatch();
    //   dispatch(showCommunityRoleModal({ type: communityRoleType, badgeOriginalType: type }));
    // }
  };

  const isAlignRight = align === 'right';
  const showSecondaryText = secondaryText && !isAlignRight;

  function getText() {
    if (breakText && !showSecondaryText) {
      const breakText = text.split(' ');
      const last = breakText.pop();
      return (
        <React.Fragment>
          <Text
            color={flipFlopColors.white}
            size={size}
            lineHeight={18}
            style={textStyle}
            numberOfLines={showSecondaryText ? 1 : 2}>
            {breakText.join(' ')}
          </Text>
          <Text
            color={flipFlopColors.white}
            size={size}
            lineHeight={18}
            style={textStyle}>
            {last}
          </Text>
        </React.Fragment>
      );
    }

    return (
      <Text
        color={flipFlopColors.white}
        size={size}
        lineHeight={18}
        style={textStyle}
        numberOfLines={showSecondaryText ? 1 : 2}>
        {text}
      </Text>
    );
  }

  if (inline) {
    return (
      <TouchableOpacity
        style={[styles.wrapperInline, style]}
        onPress={onBadgePress}
        activeOpacity={1}>
        <View
          style={[
            styles.iconInline,
            {
              borderColor: bgColor,
              backgroundColor: bgColor,
              shadowColor: bgColor,
            },
            iconStyle,
          ]}>
          <AwesomeIcon
            name={iconName}
            weight="solid"
            color={iconColor}
            size={iconSize}
          />
        </View>
        <Text
          color={bgColor || flipFlopColors.white}
          size={size}
          lineHeight={15}
          style={textStyle}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        {backgroundColor: bgColor, shadowColor: bgColor},
        isAlignRight ? styles.rightAlign : styles.leftAlign,
        style,
      ]}
      onPress={onBadgePress}
      activeOpacity={1}>
      <View style={[styles.icon, iconStyle]}>
        <AwesomeIcon
          name={iconName}
          weight="solid"
          color={iconColor}
          size={iconSize}
        />
      </View>
      <View>
        {getText(text)}
        {showSecondaryText && (
          <Text
            color={flipFlopColors.white}
            size={secondarySize || size}
            lineHeight={12}
            numberOfLines={1}>
            {secondaryText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

InsiderBadge.defaultProps = {
  iconSize: 14,
  size: 15,
  iconColor: flipFlopColors.white,
  breakText: false,
};

InsiderBadge.propTypes = {
  type: PropTypes.oneOf([
    ...Object.values(userRoleTypes),
    ...Object.values(pageRoleTypes),
  ]).isRequired,
  tag: PropTypes.string,
  rolePrefix: PropTypes.string,
  iconSize: PropTypes.number,
  size: PropTypes.number,
  secondarySize: PropTypes.number,
  style: stylesScheme,
  textStyle: stylesScheme,
  iconStyle: stylesScheme,
  align: PropTypes.string,
  iconColor: PropTypes.string,
  inline: PropTypes.bool,
  breakText: PropTypes.bool,
  preventPress: PropTypes.bool,
  originEntity: PropTypes.string,
};

export default InsiderBadge;
