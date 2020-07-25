import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {plural} from 'pluralize';
// import { apiQuery } from '/redux/apiQuery/actions';
import I18n from '../../../infra/localization';

import {get} from '../../../infra/utils';
import {navigationService} from '../../../infra/navigation';
import {flipFlopColors} from '../../../vars';
import {mediaScheme, userScheme} from '../../../schemas/common';

import {
  screenNames,
  screenGroupNames,
  postTypes,
  uiColorDefinitions,
  suggestedItemTypes,
  postSubTypes,
  originTypes,
} from '../../../vars/enums';
import SuggestedItemsRender from './SuggestedItemsRender';

const getEntityType = {
  [suggestedItemTypes.SUGGESTED_PAGES]: 'page',
  [suggestedItemTypes.SUGGESTED_POSTS]: 'post',
  [suggestedItemTypes.SUGGESTED_GROUPS]: 'group',
  [suggestedItemTypes.SUGGESTED_EVENTS]: 'event',
  [suggestedItemTypes.SUGGESTED_LISTS]: 'list',
};

class SuggestedItemsProvider extends React.Component {
  static navigateToSuggestedPages = (navigationParams) => {
    navigationService.navigate(screenNames.Pages, navigationParams);
  };

  static navigateToSuggestedGroups = (navigationParams) => {
    navigationService.navigate(screenGroupNames.GROUPS_TAB, navigationParams, {
      tabReset: true,
    });
  };

  static navigateToSuggestedEvents = (navigationParams) => {
    navigationService.navigate(screenNames.Events, navigationParams);
  };

  static navigateToSuggestedLists = (navigationParams) => {
    navigationService.navigate(screenNames.ListOfLists, navigationParams);
  };

  static navigateToAllPosts = ({
    postType,
    postSubType,
    tags,
    activationId,
  }) => () => {
    switch (postType) {
      case postTypes.GUIDE: {
        navigationService.navigate(screenNames.PostListsView, {postType, tags});
        break;
      }
      case postTypes.REAL_ESTATE:
      case postTypes.JOB:
      case postTypes.GIVE_TAKE:
      case postTypes.TIP_REQUEST:
      case postTypes.PROMOTION:
      case postTypes.ACTIVATION:
      case postTypes.RECOMMENDATION: {
        navigationService.navigate(screenNames.CityResults, {
          postType,
          initialTab: postSubType,
          chosenFilter: tags,
          activationId,
        });
        break;
      }
      default:
        break;
    }
  };

  render() {
    const {
      tags,
      originType,
      postType,
      items,
      isLoaded,
      numOfItemsToShow,
      type,
      id,
    } = this.props;
    const entityType = getEntityType[type];
    const displayedItems = items && items.slice(0, numOfItemsToShow);
    return (
      <SuggestedItemsRender
        originType={originType}
        header={this.header}
        navigateToAll={this.navigateToAll}
        color={this.color}
        tags={tags}
        entityType={entityType}
        postType={postType}
        items={displayedItems}
        isLoaded={isLoaded}
        type={type}
        carouselId={id}
      />
    );
  }

  componentDidMount() {
    this.setupQueryParams();
    this.loadItems();
  }

  componentDidUpdate(prevProps) {
    const {tags = ''} = this.props;
    const {tags: oldTags = ''} = prevProps;
    if (oldTags !== tags) {
      this.setupQueryParams();
      this.loadItems();
    }
  }

  setupQueryParams = () => {
    const {
      theme,
      type,
      postType,
      postSubType,
      numOfItemsToShow,
      title,
      tags,
      onlyFeatured,
      user,
      id,
      activationId,
      selectedCommunityId,
    } = this.props;
    const isCommunityLanguageSelected =
      user.settings.language === user.community.defaultLanguage;

    this.queryParams = {
      domain: 'carousels',
      key: 'getEntities',
      params: {
        id,
        perPage: numOfItemsToShow || 10,
        communityId: selectedCommunityId,
      },
    };
    this.normalizedSchema = 'MIXED_TYPE_ENTITIES';
    this.reducerPath = `suggestedItems.mixed.${id}`;
    this.header = isCommunityLanguageSelected
      ? title
      : I18n.t(`feed.suggested_items.${plural(type)}_header`);

    switch (type) {
      case suggestedItemTypes.SUGGESTED_POSTS:
        {
          const postHeader = tags
            ? `feed.suggested_items.posts_${postType}_${tags}_header`
            : `feed.suggested_items.posts_${postType}_header`;
          this.header = isCommunityLanguageSelected
            ? title
            : I18n.t(postHeader, {
                defaults: [{scope: 'feed.suggested_items.generic_header'}],
              });
          this.navigateToAll = SuggestedItemsProvider.navigateToAllPosts({
            type,
            postType,
            postSubType,
            tags,
            activationId,
          });
          this.color = uiColorDefinitions[postType];
        }
        break;
      case suggestedItemTypes.SUGGESTED_PAGES:
        this.navigateToAll = SuggestedItemsProvider.navigateToSuggestedPages;
        this.color = flipFlopColors.greenBlue;
        break;
      case suggestedItemTypes.SUGGESTED_GROUPS:
        this.navigateToAll = SuggestedItemsProvider.navigateToSuggestedGroups;
        this.color = flipFlopColors.greenBlue;
        break;
      case suggestedItemTypes.SUGGESTED_EVENTS:
        this.navigateToAll = SuggestedItemsProvider.navigateToSuggestedEvents;
        this.color = flipFlopColors.greenBlue;
        break;
      case suggestedItemTypes.SUGGESTED_LISTS:
        this.navigateToAll = SuggestedItemsProvider.navigateToSuggestedLists;
        this.color = flipFlopColors.greenBlue;
        break;
      case suggestedItemTypes.SUGGESTED_MIXED:
        this.header = title;
        this.color = flipFlopColors.greenBlue;
        break;
      case suggestedItemTypes.SUGGESTED_THEMES:
        this.header = title;
        this.color = flipFlopColors.greenBlue;
        this.reducerPath = `themes.allThemeItems.${theme}${
          tags ? `.${tags}` : ''
        }`;
        this.queryParams = {
          domain: 'themes',
          key: 'getItemsByThemes',
          params: {themes: theme, featured: onlyFeatured, tags},
        };
        break;
      default:
        break;
    }
  };

  loadItems = () => {
    // if (this.queryParams) {
    //   this.props.apiQuery({ normalizedSchema: this.normalizedSchema, reducerStatePath: this.reducerPath, query: this.queryParams, options: this.queryOptions });
    // }
  };
}

SuggestedItemsProvider.propTypes = {
  id: PropTypes.string,
  numOfItemsToShow: PropTypes.number,
  title: PropTypes.string,
  type: PropTypes.oneOf(Object.values(suggestedItemTypes)),
  postType: PropTypes.oneOf(Object.values(postTypes)),
  postSubType: PropTypes.oneOf([...Object.values(postSubTypes), '']),
  onlyFeatured: PropTypes.bool,
  tags: PropTypes.string,
  activationId: PropTypes.string,
  theme: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        category: PropTypes.shape({
          name: PropTypes.string,
        }),
        media: mediaScheme,
      }),
    ]),
  ),
  isLoaded: PropTypes.bool,
  user: userScheme,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  //   apiQuery: PropTypes.func,
  selectedCommunityId: PropTypes.string,
};

const mapDispatchToProps = {
  //   apiQuery
};

const mapStateToProps = (state, ownProps) => {
  const {type, tags, id, theme} = ownProps;
  let reducerPath;

  switch (type) {
    case suggestedItemTypes.SUGGESTED_POSTS:
    case suggestedItemTypes.SUGGESTED_PAGES:
    case suggestedItemTypes.SUGGESTED_GROUPS:
    case suggestedItemTypes.SUGGESTED_EVENTS:
    case suggestedItemTypes.SUGGESTED_LISTS:
    case suggestedItemTypes.SUGGESTED_MIXED:
      reducerPath = `suggestedItems.mixed.${id}`;
      break;
    case suggestedItemTypes.SUGGESTED_THEMES:
      reducerPath = `themes.allThemeItems.${theme}${tags ? `.${tags}` : ''}`;
      break;
    default:
      break;
  }

  return {
    items: get(state, `${reducerPath}.data`),
    isLoaded: get(state, `${reducerPath}.loaded`),
    user: state.auth.user,
    selectedCommunityId: get(state, 'general.selectedCommunity.id'),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SuggestedItemsProvider);
