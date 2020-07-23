import React from 'react';
import {isString} from 'lodash';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AwesomeIcon} from '../../assets/icons';
import {View, Text, Avatar, Checkbox} from '../basicComponents';

import {flipFlopColors} from '../../vars';
import {iconMaskTypes, checkboxStyles} from '../../vars/enums';
import {listMenuItemSchema} from './schema';

function isNode(value) {
  return React.isValidElement(value);
}

const styles = StyleSheet.create({
  pickerIconWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 70,
    flexDirection: 'row',
    paddingHorizontal: 1,
    borderBottomColor: flipFlopColors.b95,
    borderBottomWidth: 1,
  },
  avatarIcon: {
    marginRight: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  pickerFirstIconWrapper: {
    height: 70,
  },
  pickerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    marginRight: 10,
  },
  pickerIconBorder: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: flipFlopColors.b90,
  },
  pickerIconDouble: {
    position: 'absolute',
  },
  pickerRightIcon: {
    marginLeft: 'auto',
  },
  pickerIconTextWrapper: {
    paddingRight: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pickerIconText: {
    textAlign: 'center',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    marginRight: 10,
  },
});

const getIconProps = ({icon}) => {
  const IconComponent = isNode(icon) ? icon : null;
  const iconProps =
    isString(icon) || IconComponent
      ? {
          name: !IconComponent ? icon : '',
        }
      : icon;

  const {
    name: iconName = '',
    url: iconUrl,
    size: iconSize = 20,
    weight: iconWeight = 'light',
    color: iconColor = flipFlopColors.b30,
    style: iconStyle = {},
    iconMask = iconMaskTypes.DEFAULT,
  } = iconProps;

  return {
    iconName,
    iconUrl,
    iconSize,
    iconWeight,
    iconColor,
    iconStyle,
    IconComponent,
    iconMask,
  };
};

// eslint-disable-next-line react/prop-types
const renderIconComponent = ({icon, data = {}, withBorder}) => {
  const {IconComponent, iconStyle, ...iconProps} = getIconProps({icon});
  const {
    iconName,
    iconSize,
    iconWeight,
    iconColor,
    iconMask,
    iconUrl,
  } = iconProps;
  const isDoubleMask = iconMask === iconMaskTypes.DOUBLE;
  const {type: entityType, id, name} = data;

  if (!IconComponent && !iconName && !(iconUrl || iconUrl === '')) return null;

  if (IconComponent) {
    return <IconComponent {...iconProps} />;
  }

  switch (iconMask) {
    case iconMaskTypes.AVATAR:
      return (
        <View style={styles.avatarIcon}>
          <Avatar
            entityId={id}
            size="medium1"
            name={name}
            entityType={entityType}
            thumbnail={iconUrl}
            linkable={false}
          />
        </View>
      );
    default:
      return (
        <View
          style={[styles.pickerIcon, withBorder && styles.pickerIconBorder]}>
          <AwesomeIcon
            name={iconName}
            size={iconSize}
            weight={isDoubleMask ? 'solid' : iconWeight}
            color={iconColor}
            style={[iconStyle]}
          />
          {isDoubleMask && (
            <AwesomeIcon
              name={iconName}
              size={iconSize}
              weight="light"
              color={flipFlopColors.b30}
              style={[iconStyle, styles.pickerIconDouble]}
            />
          )}
        </View>
      );
  }
};

const renderRightIconComponent = ({rightSideIcon, isSelected}) => {
  const {IconComponent, iconStyle, ...iconProps} = getIconProps({
    icon: rightSideIcon,
  });
  const {iconName, iconSize, iconWeight, iconColor} = iconProps;

  if (isSelected || (!IconComponent && !iconName)) return null;

  const Component = IconComponent ? (
    <IconComponent {...iconProps} />
  ) : (
    <AwesomeIcon
      name={iconName}
      size={iconSize}
      weight={iconWeight}
      color={iconColor}
      style={[styles.pickerRightIcon, iconStyle]}
    />
  );

  return Component;
};

const getTextProps = ({text}) => {
  let textProps = text;
  let TextComponent = null;
  if (isString(text)) {
    textProps = {
      caption: text,
    };
  }
  if (isNode(text)) {
    textProps = {};
    TextComponent = text;
  }
  const {
    caption: textCaption = '',
    size = 16,
    color = flipFlopColors.b30,
    lineHeight = 17,
    style: textStyle = {},
  } = textProps;

  return {
    textCaption,
    size,
    lineHeight,
    textStyle,
    TextComponent,
    color,
  };
};

const renderText = ({text, isSelected, count}) => {
  const {TextComponent, textStyle, ...textProps} = getTextProps({text});
  const {textCaption} = textProps;
  const selectedTextStyle = isSelected ? {color: flipFlopColors.green} : {};
  if (!TextComponent && !textCaption) return null;

  const Component = TextComponent ? (
    <TextComponent {...textProps} />
  ) : (
    <View style={styles.pickerIconTextWrapper}>
      <Text
        {...textProps}
        {...selectedTextStyle}
        numberOfLines={1}
        style={[styles.pickerIconText, textStyle]}>
        {textCaption}
        {count && ` (${count}) `}
      </Text>
    </View>
  );

  return Component;
};

const renderCircleSelector = ({isSelected}) =>
  isSelected && (
    <AwesomeIcon
      name={'check-circle'}
      weight={'solid'}
      size={20}
      color={flipFlopColors.green}
      style={[styles.pickerRightIcon]}
    />
  );

// eslint-disable-next-line react/prop-types
const renderRectangleSelector = ({isSelected}) => (
  <Checkbox
    value={isSelected}
    size="small"
    selectedBackgroundColor={flipFlopColors.green}
    style={styles.checkbox}
  />
);

const listMenuItem = ({
  text = {},
  icon = {},
  rightSideIcon = {},
  id,
  onItemClick,
  isSelected,
  isSelectable,
  data = {},
  count,
  index,
  withBorder,
  checkboxStyle = checkboxStyles.CIRCLE,
} = {}) => {
  const itemId = id || index;

  return (
    <TouchableOpacity
      onPress={() => onItemClick({id: itemId, isSelectable, data})}
      activeOpacity={1}
      style={[
        styles.pickerIconWrapper,
        index === 0 ? styles.pickerFirstIconWrapper : {},
      ]}
      key={itemId}>
      {checkboxStyle === checkboxStyles.RECTANGLE &&
        renderRectangleSelector({isSelected})}
      {renderIconComponent({icon, data, withBorder})}
      {renderText({text, isSelected, count})}
      {renderRightIconComponent({rightSideIcon, isSelected, data})}
      {checkboxStyle === checkboxStyles.CIRCLE &&
        renderCircleSelector({isSelected})}
    </TouchableOpacity>
  );
};

listMenuItem.propTypes = listMenuItemSchema;

export default listMenuItem;
