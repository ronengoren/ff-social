import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {get} from '../../infra/utils';
import {View} from '../basicComponents';
import {commonStyles} from '../../vars';
import {toCurrency} from '../../infra/utils/stringUtils';
import {
  postTypes,
  entityTypes,
  screenNames,
  screenGroupNames,
  groupPrivacyType,
  originTypes,
  postSubTypes,
} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import PostBreadcrumbs from './PostBreadcrumbs';
import PostContentMetaTitle from './PostContentMetaTitle';

class PostContentMeta extends React.Component {
  render() {
    const {style, isBreadcrumbsShown, isLinkable, originType} = this.props;

    const {
      mainTitle,
      entityType,
      mainTag,
      postType,
      mainAction,
      secondaryAction,
      subTags,
      additionalTags,
      metaTitle,
    } = this.getPostMeta();

    if (!mainTitle && !metaTitle) {
      return null;
    }

    return (
      <View style={style} onStartShouldSetResponder={() => !!isLinkable}>
        <View>
          {isLinkable ? (
            <TouchableOpacity activeOpacity={1} onPress={secondaryAction}>
              <View style={commonStyles.flexDirectionRow}>{metaTitle}</View>
            </TouchableOpacity>
          ) : (
            <View style={commonStyles.flexDirectionRow}>{metaTitle}</View>
          )}

          {isBreadcrumbsShown && !!mainTag && (
            <PostBreadcrumbs
              mainTag={mainTag}
              subTags={subTags}
              additionalTags={additionalTags}
              mainAction={mainAction}
              secondaryAction={secondaryAction}
              entityType={entityType}
              postType={postType}
              originType={originType}
            />
          )}
        </View>
      </View>
    );
  }

  getPostMeta = () => {
    const {
      isPostPage,
      withMarginTop,
      contentType,
      context,
      postSubType,
      tags,
      price,
      isRtl,
      currency,
    } = this.props;
    let mainTitle = null;
    let metaTitle = null;
    let mainTag;
    let mainAction;
    let secondaryAction;
    let postType;
    let entityType;
    let subTags;
    let additionalTags;
    const localPrice = toCurrency(price, currency);
    switch (contentType) {
      case postTypes.GIVE_TAKE: {
        if (tags && tags.length) {
          mainTitle = I18n.t(
            `postTypes.${contentType}.${postSubType}.${tags[0]}`,
          );
        } else {
          mainTitle =
            postSubType === postSubTypes.OFFERING
              ? I18n.t(`postTypes.${contentType}.generic_header`)
              : I18n.t(`postTypes.${contentType}.${postSubType}`);
        }

        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            prefixTitle={localPrice}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        mainTag = I18n.t('tags.give_take');
        mainAction = this.navigateToResults;
        secondaryAction = () => this.navigateToResults(null, tags);
        postType = postTypes.GIVE_TAKE;
        subTags = tags;
        break;
      }
      case postTypes.JOB: {
        mainTitle = I18n.t(`postTypes.${contentType}.${postSubType}`);
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        mainTag = I18n.t('tags.jobs');
        mainAction = this.navigateToResults;
        secondaryAction = () => this.navigateToResults(null, tags);
        postType = postTypes.JOB;
        subTags = tags;
        break;
      }
      case postTypes.REAL_ESTATE: {
        mainTitle = I18n.t(
          `postTypes.${contentType}.${postSubType}.${tags[0]}`,
          {defaults: [{scope: `postTypes.${contentType}.generic_header`}]},
        );
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            prefixTitle={localPrice}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        mainTag = I18n.t('tags.real_estate');
        mainAction = this.navigateToResults;
        secondaryAction = () => this.navigateToResults(null, tags);
        postType = postTypes.REAL_ESTATE;
        subTags = tags;
        break;
      }
      case postTypes.RECOMMENDATION: {
        mainTitle = I18n.t(`postTypes.${contentType}`);
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        mainTag = I18n.t('tags.recommendation');
        additionalTags = tags;
        mainAction = this.navigateToResults;
        secondaryAction = this.navigateToResults;
        postType = postTypes.RECOMMENDATION;

        break;
      }
      case postTypes.GUIDE:
      case postTypes.GROUP_ANNOUNCEMENT:
      case postTypes.TIP_REQUEST:
      case postTypes.PROMOTION:
      case postTypes.PACKAGE: {
        mainTitle = I18n.t(`postTypes.${contentType}`);
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        if (contentType === postTypes.GUIDE) {
          additionalTags = tags;
          mainAction = () =>
            navigationService.navigate(screenNames.PostListsView, {
              postType: contentType,
            });
          secondaryAction = () =>
            navigationService.navigate(screenNames.PostListsView, {
              postType: postTypes.GUIDE,
              selectedTheme: tags,
            });
        } else if (contentType === postTypes.GROUP_ANNOUNCEMENT) {
          secondaryAction = () =>
            navigationService.navigate(screenNames.CityResults, {
              postType: contentType,
              contextId: context.id,
            });
        } else {
          secondaryAction = () =>
            navigationService.navigate(screenNames.CityResults, {
              postType: contentType,
            });
        }
        postType = contentType;
        break;
      }
      case entityTypes.GROUP: {
        const {privacyType, contentType} = this.props;
        mainTitle =
          privacyType === groupPrivacyType.PRIVATE
            ? I18n.t('posts.group.private_group')
            : I18n.t('posts.group.public_group');
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        mainTag = I18n.t('tags.groups');
        additionalTags = tags;
        secondaryAction = () =>
          navigationService.navigate(
            screenGroupNames.GROUPS_TAB,
            {tags},
            {tabReset: true},
          );
        entityType = entityTypes.GROUP;
        break;
      }
      case entityTypes.PAGE: {
        mainTitle = I18n.t('tags.pages');
        mainTag = I18n.t('tags.pages');
        metaTitle = (
          <PostContentMetaTitle
            isPostPage={isPostPage}
            contentType={contentType}
            title={mainTitle}
            isRtl={isRtl}
            withMarginTop={withMarginTop}
          />
        );
        additionalTags = tags;
        entityType = entityTypes.PAGE;
        break;
      }
      default:
        break;
    }

    return {
      metaTitle,
      mainTitle,
      mainTag,
      subTags,
      additionalTags,
      mainAction,
      secondaryAction,
      postType,
      entityType,
    };
  };

  navigateToResults = (tag, chosenFilter) => {
    const {contentType, postSubType, origin} = this.props;
    if (origin === screenNames.CityResults) {
      navigationService.goBack();
    } else if (
      [postTypes.REAL_ESTATE, postTypes.GIVE_TAKE, postTypes.JOB].includes(
        contentType,
      )
    ) {
      navigationService.navigate(screenNames.CityResults, {
        postType: contentType,
        initialTab: postSubType,
        chosenFilter,
      });
    } else {
      navigationService.navigate(screenNames.CityResults, {
        postType: contentType,
        postSubType,
      });
    }
  };
}

PostContentMeta.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  contentType: PropTypes.oneOf([
    ...Object.values(postTypes),
    ...Object.values(entityTypes),
  ]),
  postSubType: PropTypes.string,
  tags: PropTypes.array,
  origin: PropTypes.string,
  isRtl: PropTypes.bool,
  isPostPage: PropTypes.bool,
  context: PropTypes.object,
  privacyType: PropTypes.oneOf(Object.values(groupPrivacyType)),
  originType: PropTypes.oneOf(Object.values(originTypes)),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isBreadcrumbsShown: PropTypes.bool,
  isLinkable: PropTypes.bool,
  currency: PropTypes.string,
  withMarginTop: PropTypes.bool,
};

PostContentMeta.defaultProps = {
  withMarginTop: true,
  isLinkable: true,
};

const mapStateToProps = (state) => ({
  currency: get(state, 'auth.user.community.destinationPricing.currencyCode'),
});

PostContentMeta = connect(mapStateToProps)(PostContentMeta);

export default PostContentMeta;
