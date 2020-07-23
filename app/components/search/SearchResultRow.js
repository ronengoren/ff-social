import React from 'react';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {View, Text, Separator, Avatar} from '../basicComponents';
import {entityTypes, dateAndTimeFormats, groupType} from '../../vars/enums';
import {flipFlopColors} from '../../vars';
import {getFormattedDateAndTime} from '../../infra/utils/dateTimeUtils';
import {
  addSpaceOnCapitalsAndCapitalize,
  isHebrewOrArabic,
} from '../../infra/utils/stringUtils';
import {get} from '../../infra/utils';
import {MY_HOOD} from '../../components/themes';

const ITEM_HEIGHT = 71;

const styles = {
  container: {
    flex: 1,
    height: ITEM_HEIGHT,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  separator: {
    borderTopWidth: 0,
    height: 0,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingRight: 15,
  },
  textWrapper: {
    flex: 1,
    height: 40,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  resultName: {
    fontSize: 18,
  },
  lowerTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowerText: {
    color: flipFlopColors.buttonGrey,
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

class SearchResultRow extends React.PureComponent {
  render = () => {
    const {searchResult, onPress, shouldShowSeparator} = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => onPress(searchResult)}>
        <View style={styles.container}>
          <View style={styles.content}>
            {this.renderEntityImage()}
            <View style={styles.textWrapper}>
              <Text
                size={18}
                lineHeight={21}
                bold
                color={flipFlopColors.b30}
                numberOfLines={1}>
                {searchResult.name}
              </Text>
              <View style={styles.lowerTextWrapper}>
                {this.renderEntityTypeName()}
                {this.renderEntityExtraInformation()}
              </View>
            </View>
          </View>
          {shouldShowSeparator && (
            <Separator
              color={flipFlopColors.disabledGrey}
              style={styles.separator}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  entityTypeToExtraInformation(entity) {
    const {destinationPartitionLevel} = this.props;
    switch (entity.entityType) {
      case entityTypes.USER:
        return entity.location;
      case entityTypes.PAGE:
        return (
          entity.tags &&
          entity.tags.map((tag) => {
            if (tag === MY_HOOD) {
              return I18n.t(`themes.${tag}.${destinationPartitionLevel}`, {
                defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
              });
            } else {
              return I18n.t(`shared.tags.${tag}`, {
                defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
              });
            }
          })
        );
      case entityTypes.LIST:
        return I18n.p(entity.numOfItems, 'search.result.num_of_items');
      case entityTypes.EVENT: {
        const date = new Date(entity.startTime);
        return `${getFormattedDateAndTime(
          date,
          dateAndTimeFormats.eventShortDate,
        )}`;
      }
      default:
        return null;
    }
  }

  renderEntityTypeName = () => {
    const {searchResult} = this.props;
    const {entityType, subTags, _highlightResult} = searchResult;
    const isTopic = searchResult.groupType === groupType.TOPIC;

    let text;
    if (isTopic && _highlightResult && _highlightResult.subTags) {
      const matchedSubTagIndex = _highlightResult.subTags.findIndex(
        (subTag) => subTag.matchedWords.length,
      );
      if (matchedSubTagIndex > -1) {
        const matchedSubTag = subTags[matchedSubTagIndex];
        text = addSpaceOnCapitalsAndCapitalize(matchedSubTag);
      }
    }

    if (!text) {
      text = I18n.t(`entity_type_to_name.${isTopic ? 'topic' : entityType}`);
    }

    return (
      <Text
        size={13}
        lineHeight={15}
        style={styles.lowerText}
        numberOfLines={1}>
        {text}
      </Text>
    );
  };

  renderEntityExtraInformation = () => {
    const {searchResult} = this.props;
    const extraInformation = this.entityTypeToExtraInformation(searchResult);
    const isHebrewText = isHebrewOrArabic(extraInformation);
    if (extraInformation) {
      return [
        this.renderDot(),
        Array.isArray(extraInformation) ? (
          extraInformation.map((item, idx) => [
            <Text
              key={`informationText-${idx}`} // eslint-disable-line react/no-array-index-key
              value={extraInformation}
              size={isHebrewText ? 13 : 12}
              lineHeight={isHebrewText ? 21 : 15}
              style={styles.lowerText}
              numberOfLines={1}>
              {item}
            </Text>,
            idx === extraInformation.length - 1 ? null : this.renderDot(),
          ])
        ) : (
          <Text
            key="informationText"
            value={extraInformation}
            size={isHebrewText ? 13 : 12}
            lineHeight={isHebrewText ? 21 : 15}
            style={styles.lowerText}
            numberOfLines={1}>
            {extraInformation}
          </Text>
        ),
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
  };
}

SearchResultRow.defaultProps = {
  shouldShowSeparator: true,
};

SearchResultRow.propTypes = {
  searchResult: PropTypes.object,
  onPress: PropTypes.func,
  shouldShowSeparator: PropTypes.bool,
  destinationPartitionLevel: PropTypes.string,
};

const mapStateToProps = (state) => ({
  destinationPartitionLevel: get(
    state,
    'auth.user.community.destinationPartitionLevel',
  ),
});

SearchResultRow = connect(mapStateToProps)(SearchResultRow);

export {SearchResultRow, ITEM_HEIGHT};
