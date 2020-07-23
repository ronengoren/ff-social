import React from 'react';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {View, Text, Separator, Avatar, DashedBorder} from '../basicComponents';
// import {getPostTimeText} from '/components/posts/utils';
import {
  HtmlText,
  // , mentionUtils
} from '../../components';
import {entityTypes, dateAndTimeFormats, groupType} from '../../vars/enums';
import {flipFlopColors, commonStyles} from '../../vars';
import {getFormattedDateAndTime} from '../../infra/utils/dateTimeUtils';
import {
  addSpaceOnCapitalsAndCapitalize,
  isHebrewOrArabic,
} from '../../infra/utils/stringUtils';
import {get} from '../../infra/utils';
import {MY_HOOD} from '../../components/themes';

// import {getTranslatedPostType} from '../posts/utils';

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    ...commonStyles.shadow,
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  containerHeader: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
  },
  contentHeaderAvatar: {
    marginRight: 10,
  },
  contentHeaderActorName: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: 'bold',
    color: flipFlopColors.b30,
  },
  separator: {
    borderTopWidth: 0,
    height: 0,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 14,
    maxHeight: 65,
  },
  contentWithoutActor: {
    marginTop: 5,
  },
  textWrapper: {
    flex: 1,
    height: 40,
    justifyContent: 'space-between',
    marginLeft: 0,
    marginRight: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 12,
  },
  resultName: {
    fontSize: 18,
  },
  lowerTextWrapper: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowerTextHeb: {
    paddingTop: 2,
  },
  icon: {
    paddingRight: 7,
  },
  headerImageWrapper: {
    borderRadius: 3,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  boldedEntityTypeName: {
    fontSize: 13,
    lineHeight: 15,
    color: flipFlopColors.buttonGrey,
  },
};

class EntitySearchResultRow extends React.PureComponent {
  render() {
    const {searchResult, onPress, shouldShowSeparator} = this.props;
    const {actor, name} = searchResult;
    const isEntityNameShown = !!name;
    return (
      <TouchableWithoutFeedback onPress={() => onPress(searchResult)}>
        <View style={styles.container}>
          {!!actor && [
            <View style={styles.containerHeader} key="actorHeader">
              <Avatar
                size="medium1"
                entityId={actor.id}
                entityType={actor.type}
                thumbnail={actor.thumbnail}
                linkable={false}
                name={actor.name}
                imageStyle={styles.contentHeaderAvatar}
              />
              <View>
                <Text style={styles.contentHeaderActorName}>{actor.name}</Text>
                <View style={styles.lowerTextWrapper}>
                  {this.renderEntityTypeName()}
                  {this.renderEntityExtraInformation()}
                </View>
              </View>
            </View>,
            <DashedBorder key="actorDashedbottom" />,
          ]}
          <View style={[styles.content, !actor && styles.contentWithoutActor]}>
            <View style={styles.textWrapper}>
              {isEntityNameShown && (
                <Text
                  size={16}
                  lineHeight={22}
                  bold
                  color={flipFlopColors.b30}
                  numberOfLines={1}>
                  {name}
                </Text>
              )}
              <View style={styles.lowerTextWrapper}>
                {this.renderEntityDescription({
                  numOfLines: isEntityNameShown ? 1 : 2,
                })}
              </View>
            </View>
            {this.renderEntityImage()}
          </View>
          {!!shouldShowSeparator && (
            <Separator
              color={flipFlopColors.disabledGrey}
              style={styles.separator}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getEntityTypeToExtraInformation(entity) {
    // const {destinationPartitionLevel, user} = this.props;
    // switch (entity.entityType) {
    //   case entityTypes.USER:
    //     return [entity.location];
    //   case entityTypes.PAGE:
    //     return (
    //       entity.tags &&
    //       entity.tags.map((tag) => {
    //         if (tag === MY_HOOD) {
    //           return [
    //             I18n.t(`themes.${tag}.${destinationPartitionLevel}`, {
    //               defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
    //             }),
    //           ];
    //         } else {
    //           return [
    //             I18n.t(`shared.tags.${tag}`, {
    //               defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
    //             }),
    //           ];
    //         }
    //       })
    //     );
    //   case entityTypes.LIST:
    //     return [I18n.p(entity.numOfItems, 'search.result.num_of_items')];
    //   case entityTypes.EVENT: {
    //     const date = new Date(entity.startTime);
    //     return [
    //       `${getFormattedDateAndTime(date, dateAndTimeFormats.eventShortDate)}`,
    //     ];
    //   }
    //   case entityTypes.POST: {
    //     if (entity.createdAt) {
    //       const {createdAt} = entity;
    //       return [getPostTimeText({eventTime: createdAt, user})];
    //     }
    //     return [];
    //   }
    //   case entityTypes.GROUP: {
    //     return [
    //       entity.membersCount
    //         ? I18n.p(entity.membersCount, 'search.result.num_of_members')
    //         : '',
    //     ];
    //   }
    //   default:
    //     return [];
    // }
  }

  renderEntityTypeName = () => {
    // const {searchResult} = this.props;
    // const {entityType, subTags, _highlightResult, objectID} = searchResult;
    // const isTopic = searchResult.groupType === groupType.TOPIC;
    // let text;
    // if (isTopic && _highlightResult) {
    //   const matchedSubTagIndex = _highlightResult.subTags.findIndex(
    //     (subTag) => subTag.matchedWords.length,
    //   );
    //   if (matchedSubTagIndex > -1) {
    //     const matchedSubTag = subTags[matchedSubTagIndex];
    //     text = addSpaceOnCapitalsAndCapitalize(matchedSubTag);
    //   }
    // }
    // if (!text) {
    //   if (entityType === entityTypes.POST) {
    //     const {tags, postType, postSubType} = searchResult;
    //     text = getTranslatedPostType({
    //       postType,
    //       postSubType,
    //       tags,
    //     });
    //   } else {
    //     text = I18n.t(`entity_type_to_name.${isTopic ? 'topic' : entityType}`);
    //   }
    // }
    // const isHebrewText = isHebrewOrArabic(text);
    // return (
    //   <Text
    //     size={isHebrewText ? 13 : 12}
    //     lineHeight={isHebrewText ? 17 : 15}
    //     style={[styles.lowerText, isHebrewText && styles.lowerTextHeb]}
    //     numberOfLines={1}
    //     key={`entityType${objectID}`}>
    //     {text}
    //   </Text>
    // );
  };

  renderEntityDescription = ({numOfLines}) => {
    // const {searchResult: entity} = this.props;
    // const {entityType} = entity;
    // let description = '';
    // switch (entityType) {
    //   case entityTypes.USER:
    //     description = entity.location;
    //     break;
    //   case entityTypes.LIST:
    //   case entityTypes.EVENT:
    //   case entityTypes.POST:
    //     description = mentionUtils.removeMentions({text: entity.description});
    //     break;
    //   case entityTypes.PAGE:
    //   case entityTypes.GROUP:
    //     return (
    //       <Text
    //         size={isHebrewText ? 16 : 15}
    //         lineHeight={isHebrewText ? 19 : 18}
    //         numberOfLines={numOfLines}>
    //         {this.renderEntityTypeName()}
    //         {this.renderEntityExtraInformation()}
    //       </Text>
    //     );
    //   case entityTypes.NEIGHBORHOOD:
    //     return [this.renderEntityTypeName()];
    //   default:
    //     return null;
    // }
    // const isHebrewText = isHebrewOrArabic(description);
    // return (
    //   <HtmlText
    //     showTranslateButton={false}
    //     value={description}
    //     key="informationText"
    //     size={isHebrewText ? 16 : 15}
    //     lineHeight={isHebrewText ? 19 : 18}
    //     numberOfLines={numOfLines}
    //     showExpand={false}
    //   />
    // );
  };

  renderEntityExtraInformation = () => {
    const {searchResult} = this.props;
    const extraInformation =
      this.getEntityTypeToExtraInformation(searchResult) || [];
    const filtered = extraInformation.filter((item) => !!item);
    const isHebrewText = isHebrewOrArabic(filtered);

    if (filtered.length) {
      return [
        this.renderDot(),
        filtered.map((item, idx) => [
          <Text
            key={`informationText-${idx}`} // eslint-disable-line react/no-array-index-key
            value={item}
            size={isHebrewText ? 13 : 12}
            lineHeight={isHebrewText ? 17 : 15}
            style={[styles.lowerText, isHebrewText && styles.lowerTextHeb]}
            numberOfLines={1}>
            {item}
          </Text>,
          idx === filtered.length - 1 ? null : this.renderDot(),
        ]),
      ];
    }

    return null;
  };

  renderDot = () => (
    <Text
      key="dotText"
      bold
      size={13}
      lineHeight={15}
      color={flipFlopColors.buttonGrey}>
      &nbsp;&middot;&nbsp;
    </Text>
  );

  renderEntityImage = () => {
    const {searchResult} = this.props;
    const {entityType, thumbnail} = searchResult;
    if (entityType !== entityTypes.POST || !!thumbnail) {
      return (
        <Avatar
          entityId={searchResult.id}
          entityType={searchResult.entityType}
          name={searchResult.name}
          themeColor={searchResult.themeColor}
          thumbnail={searchResult.thumbnail}
          allowNavigation={false}
          imageStyle={styles.image}
          linkable={false}
        />
      );
    }
    return null;
  };
}

EntitySearchResultRow.defaultProps = {
  shouldShowSeparator: true,
};

EntitySearchResultRow.propTypes = {
  user: PropTypes.object,
  searchResult: PropTypes.object,
  onPress: PropTypes.func,
  shouldShowSeparator: PropTypes.bool,
  destinationPartitionLevel: PropTypes.string,
};

const mapStateToProps = (state) => ({
  user: get(state, 'auth.user'),
  destinationPartitionLevel: get(
    state,
    'auth.user.community.destinationPartitionLevel',
  ),
});

EntitySearchResultRow = connect(mapStateToProps)(EntitySearchResultRow);

export default EntitySearchResultRow;
