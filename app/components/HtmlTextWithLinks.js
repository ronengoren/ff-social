import React, {Component} from 'react';
import {Linking} from 'react-native';
import PropTypes from 'prop-types';
import branch from 'react-native-branch';
import {singular} from 'pluralize';
import {HtmlText} from '../components';
import {
  screenNames,
  screenNamesByEntityType,
  screenNamesTabByEntityType,
} from '../vars/enums';
import * as mentionUtils from '../infra/utils/mentionUtils';
import {
  call,
  mailto,
  isIosAndItunesLink,
  getQueryStringParams,
} from '../infra/utils/linkingUtils';
import {url} from '../infra/utils/formValidations';
import {navigationService} from '../infra/navigation';
import {mentionsSchema} from '../schemas/common';
import {
  entityTypes,
  entityTypeBySlug,
  postTypeBySlug,
  postTypes,
} from '../vars/enums';

class HtmlTextWithLinks extends Component {
  render() {
    const {text, mentions, ...restOfProps} = this.props;
    const enrichedText = mentionUtils.enrichText({text, mentions});
    return (
      <HtmlText
        value={enrichedText}
        onLinkPress={this.handleLinkPressed}
        {...restOfProps}
      />
    );
  }

  handleLinkPressed = (link) => {
    if (isIosAndItunesLink(link)) {
      Linking.openURL(link);
    } else if (
      link.includes('l.flipflop.com') ||
      link.includes('flipflop.test-app.link')
    ) {
      branch.openURL(link);
    } else if (link.startsWith('mailto:')) {
      mailto(link.replace('mailto:', ''));
    } else if (link.includes('flipflop.com')) {
      this.handleFlipFlopLinkPress(link);
    } else if (link.startsWith('tel:')) {
      call(link.replace('tel:', ''));
    } else if (url(null)(link).isValid) {
      navigationService.navigate(screenNames.WebView, {url: link});
    } else {
      const [entityType, entityId] = link.split(':');
      navigationService.navigate(screenNamesByEntityType[entityType], {
        entityId,
      });
    }
  };

  handleFlipFlopLinkPress = (link) => {
    const [entityTitle, entitySlug] = link.split('?')[0].split('/').reverse();

    const {postSubType, tags} = getQueryStringParams(link);

    // not all screens support navigation with filters.
    const params = {
      postSubType,
      tags,
    };
    const options = {};
    if (entityTitle) {
      params.entityId = entityTitle.split('-').pop();
    }

    let screenName;
    if (entitySlug !== 'feed') {
      const entityType = entityTypeBySlug[entitySlug] || singular(entitySlug);
      if (params.entityId) {
        screenName = screenNamesByEntityType[entityType];
      } else {
        params.postType = postTypeBySlug[entitySlug];
        if (
          entityType === entityTypes.POST &&
          params.postType === postTypes.GUIDE
        ) {
          screenName = screenNames.PostListsView;
        } else if (entityType === entityTypes.LIST) {
          screenName = screenNames.ListOfLists;
        } else {
          screenName = screenNamesTabByEntityType[entityType];
        }
      }
    }

    if (!screenName) {
      screenName = screenNames.HomeTab;
      options.noPush = true;
    }

    navigationService.navigate(screenName, params, options);
  };
}

HtmlTextWithLinks.propTypes = {
  text: PropTypes.string,
  mentions: mentionsSchema,
};

export default HtmlTextWithLinks;
