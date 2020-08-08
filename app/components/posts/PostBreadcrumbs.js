import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ScrollView, Platform} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {getThemeUI} from '../../components/themes';
import {Chip} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {
  postTypes,
  uiColorDefinitions,
  uiDefinitions,
  entityTypes,
  screenNames,
  originTypes,
  groupType,
} from '../../vars/enums';
import {stylesScheme} from '../../schemas';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {get} from '../../infra/utils';
import {
  addSpaceOnCapitalsAndCapitalize,
  isHebrewOrArabic,
} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
  },
  chipWithRightAlignedText: {
    paddingTop: 5,
    paddingBottom: 4,
  },
  chipText: {
    textAlign: 'left',
    lineHeight: 13,
    fontSize: 11,
    color: flipFlopColors.white,
  },
  chipRightAlignText: {
    lineHeight: Platform.select({ios: 14, android: 13}),
    fontSize: 12,
  },
  icon: {
    marginRight: 7,
  },
  arrowIcon: {
    lineHeight: 14,
    marginLeft: 5,
  },
  arrowIconWithTextAlignedRight: {
    lineHeight: 13,
  },
});

class PostBreadcrumbs extends React.Component {
  render() {
    const {
      mainTag,
      subTags,
      additionalTags,
      mainAction,
      secondaryAction,
      entityType,
      postType,
      style,
    } = this.props;
    const color = uiColorDefinitions[entityType || postType];
    const iconDefinitions = uiDefinitions[entityType || postType];
    const {
      isHomeisIcon,
      name,
      postBreadcrumbIconSize,
      postBreadcrumbIconLineHeight,
    } = iconDefinitions;
    const IconComponent = isHomeisIcon ? HomeisIcon : AwesomeIcon;
    const iconSize = isHomeisIcon ? postBreadcrumbIconSize : 11;
    const iconLineHeight = postBreadcrumbIconLineHeight || 11;
    const beforeTextComponent = (
      <IconComponent
        name={name}
        color={flipFlopColors.white}
        size={iconSize}
        weight="solid"
        style={[styles.icon, {lineHeight: iconLineHeight}]}
      />
    );
    const isTitleAlignRight = isHebrewOrArabic(mainTag);
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}>
        {this.renderChip({
          onPress: mainAction || secondaryAction,
          name: mainTag,
          beforeTextComponent,
          color,
          isTitleAlignRight,
        })}
        {subTags && !!subTags.length && this.renderSubTags()}
        {additionalTags &&
          !!additionalTags.length &&
          this.renderAdditionalTags()}
      </ScrollView>
    );
  }

  renderSubTags = () => {
    const {subTags, entityType, postType, secondaryAction} = this.props;
    return subTags.map((tag) => {
      const color = uiColorDefinitions[entityType || postType];
      const name = I18n.t(`shared.tags.${tag}`, {
        defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
      });
      const isTitleAlignRight = isHebrewOrArabic(tag);
      return this.renderChip({
        onPress: () => secondaryAction(tag),
        name,
        color,
        isTitleAlignRight,
      });
    });
  };

  renderAdditionalTags = () => {
    const {additionalTags, topics} = this.props;
    return additionalTags.map((tag) => {
      const topic = topics.find(
        (topic) =>
          topic.tags.indexOf(tag) !== -1 || topic.subTags.indexOf(tag) !== -1,
      );
      if (!topic) {
        return null;
      }
      const themeUIDefinition = topic
        ? getThemeUI(topic.tags[0])
        : getThemeUI(tag);
      const themeName = I18n.t(`shared.tags.${tag}`, {
        defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
      });
      const isTitleAlignRight = isHebrewOrArabic(themeName);
      const onPress = topic
        ? this.navigateToTopicPage({
            topicId: topic.id,
            groupType: groupType.TOPIC,
            subTag: tag,
          })
        : this.navigateToThemePage({
            theme: tag,
            themeColor: themeUIDefinition.backgroundColor,
          });
      return this.renderChip({
        onPress,
        name: themeName,
        color: themeUIDefinition.backgroundColor,
        isTitleAlignRight,
      });
    });
  };

  renderArrow = ({isTitleAlignRight}) => (
    <AwesomeIcon
      name="angle-right"
      size={14}
      color={flipFlopColors.white}
      style={[
        styles.arrowIcon,
        isTitleAlignRight && styles.arrowIconWithTextAlignedRight,
      ]}
    />
  );

  renderChip = ({
    onPress,
    name,
    beforeTextComponent,
    color,
    isTitleAlignRight,
  }) => (
    <Chip
      onPress={onPress}
      active
      style={[
        styles.chip,
        isTitleAlignRight && styles.chipWithRightAlignedText,
      ]}
      color={color}
      textStyle={[
        styles.chipText,
        isTitleAlignRight && styles.chipRightAlignText,
      ]}
      beforeTextComponent={beforeTextComponent}
      afterTextComponent={this.renderArrow({isTitleAlignRight})}
      key={name}>
      {name}
    </Chip>
  );

  navigateToThemePage = ({theme, themeColor}) => () => {
    const {originType} = this.props;
    navigationService.navigate(screenNames.MyThemeView, {
      theme,
      themeColor,
      originType,
    });
  };

  navigateToTopicPage = ({topicId}) => () => {
    const {originType} = this.props;
    navigationService.navigate(screenNames.GroupView, {
      entityId: topicId,
      originType,
      groupType: groupType.TOPIC,
    });
  };
}

PostBreadcrumbs.propTypes = {
  mainTag: PropTypes.string,
  subTags: PropTypes.arrayOf(PropTypes.string),
  additionalTags: PropTypes.arrayOf(PropTypes.string),
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  postType: PropTypes.oneOf(Object.values(postTypes)),
  mainAction: PropTypes.func,
  secondaryAction: PropTypes.func,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  style: stylesScheme,
  topics: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => ({
  topics: get(state.auth, 'appSettings.data.topics', []),
});

PostBreadcrumbs = connect(mapStateToProps)(PostBreadcrumbs);
export default PostBreadcrumbs;
