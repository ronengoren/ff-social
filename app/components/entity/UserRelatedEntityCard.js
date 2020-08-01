import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, Image, PlaceholderRectangle} from '../basicComponents';
import {FlipFlopIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';
import {getInitials} from '../../infra/utils/stringUtils';
import {stylesScheme} from '../../schemas';

const USER_GROUP_HOME_TAB_WIDTH = 160;
const baseStyle = {
  container: {
    width: 100,
    height: 135,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    marginTop: 15,
    marginBottom: 25,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 85,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: flipFlopColors.b90,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    marginBottom: 7,
    marginHorizontal: 10,
  },
  placeholder: {
    marginLeft: 10,
  },
  badgeOuter: {
    position: 'absolute',
    top: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: flipFlopColors.white,
  },
  badgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: flipFlopColors.pinkishRed,
  },
  badgeIcon: {
    lineHeight: 15,
    marginLeft: Platform.select({ios: 1, android: 0}),
  },
};

const secondaryStyles = StyleSheet.create({
  ...baseStyle,
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: USER_GROUP_HOME_TAB_WIDTH,
    height: 55,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    marginRight: 10,
  },
  image: {
    width: 35,
    height: 35,
    marginStart: 10,
    borderRadius: 8,
    backgroundColor: flipFlopColors.paleGreyFive,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  text: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  placeholderContainer: {
    marginTop: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  badgeOuter: {
    position: 'absolute',
    top: -8,
    right: -8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: flipFlopColors.white,
  },
});

const styles = StyleSheet.create(baseStyle);
class UserRelatedEntityCard extends Component {
  static renderPlaceholder = ({marginRight, index, isSecondary, style}) => {
    if (isSecondary) {
      return (
        <View
          style={[
            commonStyles.newSmallShadow,
            secondaryStyles.container,
            style,
            {marginRight},
          ]}
          key={index}>
          <View style={secondaryStyles.image} />
          <View style={secondaryStyles.placeholderContainer}>
            <PlaceholderRectangle
              backgroundColor={flipFlopColors.paleGreyFive}
              width={60}
              height={8}
              marginBottom={6}
              borderRadius={10}
              style={secondaryStyles.placeholder}
            />
            <PlaceholderRectangle
              backgroundColor={flipFlopColors.paleGreyFive}
              width={45}
              height={8}
              style={secondaryStyles.placeholder}
            />
          </View>
        </View>
      );
    }
    return (
      <View
        style={[commonStyles.shadow, styles.container, style, {marginRight}]}
        key={index}>
        <View style={styles.image} />
        <PlaceholderRectangle width={70} style={styles.placeholder} />
        <PlaceholderRectangle width={50} style={styles.placeholder} />
      </View>
    );
  };

  render() {
    const {
      children,
      imageSrc,
      text,
      index,
      firstItemStyle,
      showItemBadge,
      isSecondary,
      style,
      textProps,
    } = this.props;
    const componentStyles = isSecondary ? secondaryStyles : styles;
    const shadowStyle = isSecondary
      ? commonStyles.newSmallShadow
      : commonStyles.shadow;
    if (children) {
      return (
        <TouchableOpacity
          style={[
            shadowStyle,
            componentStyles.container,
            style,
            index === 0 && firstItemStyle,
          ]}
          onPress={this.handlePress}>
          {children}
        </TouchableOpacity>
      );
    }

    const [firstWord, ...restWords] = text.split(' ');

    return (
      <TouchableOpacity
        style={[
          shadowStyle,
          componentStyles.container,
          style,
          index === 0 && firstItemStyle,
        ]}
        onPress={this.handlePress}>
        {imageSrc ? (
          <Image source={imageSrc} style={componentStyles.image} />
        ) : (
          this.renderImagePlaceholder()
        )}
        <View style={componentStyles.text}>
          <Text
            size={14}
            lineHeight={17}
            color={flipFlopColors.b30}
            numberOfLines={1}
            {...textProps}>
            {firstWord}
          </Text>
          <Text
            size={14}
            lineHeight={17}
            color={flipFlopColors.b30}
            numberOfLines={1}
            {...textProps}>
            {restWords.join(' ')}
          </Text>
        </View>

        {showItemBadge && (
          <View style={componentStyles.badgeOuter}>
            <View style={componentStyles.badgeInner}>
              <FlipFlopIcon
                name="star"
                size={16}
                color={flipFlopColors.white}
                style={componentStyles.badgeIcon}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  renderImagePlaceholder() {
    const {isUserEntity, themeColor, text, isSecondary} = this.props;
    const initials = getInitials(text);
    const componentStyles = isSecondary ? secondaryStyles : styles;
    return (
      <View
        style={[
          componentStyles.image,
          isUserEntity && {backgroundColor: `#${themeColor}`},
        ]}>
        {isUserEntity ? (
          <Text
            bold
            size={!isSecondary ? 40 : 30}
            lineHeight={48}
            color={flipFlopColors.white}>
            {initials}
          </Text>
        ) : (
          <FlipFlopIcon
            name="groups-fill"
            color={flipFlopColors.white}
            size={!isSecondary ? 32 : 18}
          />
        )}
      </View>
    );
  }

  handlePress = () => {
    const {onPress, id, text, imageSrc, themeColor} = this.props;
    const params = {entityId: id, data: {name: text, themeColor}};
    if (typeof imageSrc === 'object') {
      params.data.thumbnail = imageSrc;
    }
    onPress(params);
  };
}

UserRelatedEntityCard.propTypes = {
  style: stylesScheme,
  textProps: PropTypes.object,
  children: PropTypes.node,
  firstItemStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  imageSrc: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  text: PropTypes.string,
  index: PropTypes.number,
  showItemBadge: PropTypes.bool,
  onPress: PropTypes.func,
  id: PropTypes.string,
  themeColor: PropTypes.string,
  isSecondary: PropTypes.bool,
  isUserEntity: PropTypes.bool,
};

export default UserRelatedEntityCard;
