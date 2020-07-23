import React, {Component} from 'react';
import I18n from '/infra/localization';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import {get} from '../../infra/utils';
import {
  postTypes,
  postSubTypes,
  realEstateTypes,
  jobTypes,
  giveTakeTypes,
  entityTypes,
} from '../../vars/enums';
import {addSpaceOnCapitalsAndCapitalize} from '../../infra/utils/stringUtils';
import FilterRow from './FilterRow';

class ListingTypeFilter extends Component {
  static translateThemes = memoize((themes) =>
    themes
      ? themes.map((tag) =>
          I18n.t(`shared.tags.${tag}`, {
            defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
          }),
        )
      : [],
  );

  constructor(props) {
    super(props);
    this.filterDefinitions = this.getFilterDefinitions();
  }

  render() {
    const {tags} = this.props;
    return this.filterDefinitions.tags.map((tag, index) => (
      <FilterRow
        key={tag}
        action={this.handlePressed(index)}
        index={index}
        isActive={tag === tags}
        text={this.filterDefinitions.translatedTags[index]}
      />
    ));
  }

  getFilterDefinitions = () => {
    const {
      entityType,
      postType,
      postSubType,
      suggestedEventsThemes,
    } = this.props;
    let {tags = []} = this.props;
    let translatedTags = [];
    if (postType === postTypes.JOB) {
      tags = Object.values(jobTypes);
      translatedTags = tags.map((tag) =>
        I18n.t(`post_editor.job.categories.${tag}`, {
          defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
        }),
      );
    } else if (postType === postTypes.REAL_ESTATE) {
      tags = Object.values(realEstateTypes);
      tags.forEach((tag) => {
        if (tag !== realEstateTypes.BUY_SELL) {
          translatedTags.push(
            I18n.t(`post_editor.real_estate.tag_labels.${tag}`),
          );
        }
      });
      const buySellTagTranslation =
        postSubType === postSubTypes.OFFERING
          ? I18n.t('post_editor.real_estate.tag_labels.buy')
          : I18n.t('post_editor.real_estate.tag_labels.sell');
      translatedTags.splice(
        translatedTags.length - 2,
        0,
        buySellTagTranslation,
      );
    } else if (
      postType === postTypes.GIVE_TAKE &&
      postSubType === postSubTypes.OFFERING
    ) {
      tags = Object.values(giveTakeTypes);
      translatedTags = tags.map((tag) =>
        tag === giveTakeTypes.PRICE
          ? I18n.t('post_editor.give_take.tag_labels.price')
          : I18n.t(`post_editor.give_take.tag_labels.${tag}`),
      );
    } else if (entityType === entityTypes.EVENT) {
      tags = suggestedEventsThemes;
      translatedTags = ListingTypeFilter.translateThemes(tags);
    }
    return {tags, translatedTags};
  };

  handlePressed = (selectedListingIndex) => () => {
    const {tags, onListingTypeChanged} = this.props;
    const newTags =
      tags === this.filterDefinitions.tags[selectedListingIndex]
        ? ''
        : this.filterDefinitions.tags[selectedListingIndex];
    const newTagsTranslation = !newTags
      ? ''
      : this.filterDefinitions.translatedTags[selectedListingIndex];
    onListingTypeChanged({tags: newTags, translatedTag: newTagsTranslation});
  };
}

ListingTypeFilter.propTypes = {
  onListingTypeChanged: PropTypes.func.isRequired,
  suggestedEventsThemes: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.string,
  entityType: PropTypes.string,
  postType: PropTypes.string,
  postSubType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  suggestedEventsThemes: get(state, 'events.suggestedEventsTags.data', []),
});

export default connect(mapStateToProps)(ListingTypeFilter);
