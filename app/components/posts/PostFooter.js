import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {View, Text, IconButton} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
// import { ShareableProvider } from '/components';
import images from '../../assets/images';
import {flipFlopColors} from '../../vars';
import {
  postTypes,
  screenNames,
  entityTypes,
  passivePostSubTypes,
  originTypes,
  componentNamesForAnalytics,
} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {stylesScheme, userScheme} from '../../schemas/common';
import {get, isEmpty, isAppAdmin} from '../../infra/utils';
import {numberWithCommas} from '../../infra/utils/stringUtils';
import {
  ThanksCounter,
  CommentsCounter,
  ViewsCounter,
} from './postFooterCounters';

const MINIMUM_VIEW_TO_SHOW_COUNTER = 5;

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 17,
    paddingBottom: 18,
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.white,
  },
  footerNotInPostPage: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
  },
  footerButtonLeft: {
    paddingRight: 15,
  },
  footerButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: flipFlopColors.b90,
  },
  inactiveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  inactiveText: {
    marginLeft: 10,
  },
  shareIcon: {
    height: 14,
    marginTop: -2,
    marginEnd: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const hitSlop = {left: 5, top: 15, right: 5, bottom: 15};

const postActions = {
  THANKS: 'thankers',
  WELCOMES: 'welcomes',
};
class PostFooter extends React.Component {
  constructor(props) {
    super(props);
    const {
      post: {
        payload: {postType, postSubType},
      },
    } = props;
    this.isJoinedCommunityPost =
      postType === postTypes.PASSIVE_POST &&
      postSubType === passivePostSubTypes.COMMUNITY_JOINED;
  }
  render = () => {
    const {post} = this.props;
    const isActive = get(post, 'payload.active', true);
    if (isActive) {
      return this.renderActiveFooter();
    }
    return this.renderInactiveFooter();
  };

  renderActiveFooter() {
    const {
      footerStyle,
      post,
      post: {
        comments,
        likes,
        views = 0,
        score,
        payload: {templateData = {}, postType},
      },
      user,
      isPostPage,
      isWithoutShare,
      withoutBorderBottom,
      originType,
    } = this.props;
    const shownComments = this.isListItemPassivePostComments()
      ? !isEmpty(get(templateData, 'entity.comments'))
      : comments;
    const isClapsVisible =
      (postType === postTypes.INTRODUCTION || this.isJoinedCommunityPost) &&
      !!likes;
    const isThanksVisible = postType === postTypes.ACTIVATION && !!likes;
    const isAdmin = isAppAdmin(user);

    return (
      <View
        style={[
          styles.footer,
          !isPostPage && !withoutBorderBottom && styles.footerNotInPostPage,
          footerStyle,
        ]}>
        {!!score && isAdmin && (
          <Text size={12} lineHeight={15} color={flipFlopColors.b30}>
            {`(${numberWithCommas(score)})`}
          </Text>
        )}
        <View style={styles.actions}>
          {/* <ShareableProvider entity={post} originType={originType} componentName={componentNamesForAnalytics.POST}>
            {({ shouldShowShare, openShareActionSheet }) => shouldShowShare && !isWithoutShare && this.renderShareAction({ isPostPage, openShareActionSheet })}
          </ShareableProvider> */}
          {!isPostPage && this.renderCommentButton()}
        </View>
        {!!shownComments && (
          <CommentsCounter
            comments={shownComments}
            onPress={
              isPostPage
                ? () => {}
                : this.handleCommentPress({showKeyboard: false})
            }
          />
        )}
        {isThanksVisible && (
          <ThanksCounter
            likes={likes}
            onPress={() => this.handleThanksOrWelcomeAction(postActions.THANKS)}
            imageSrc={images.emoji.thanks}
          />
        )}
        {isClapsVisible && (
          <ThanksCounter
            likes={likes}
            onPress={() =>
              this.handleThanksOrWelcomeAction(postActions.WELCOMES)
            }
            imageSrc={images.emoji.clap}
          />
        )}
        {views >= MINIMUM_VIEW_TO_SHOW_COUNTER && (
          <ViewsCounter views={views} />
        )}
      </View>
    );
  }

  renderCommentButton = () => (
    <TouchableOpacity
      hitSlop={hitSlop}
      onPress={this.handleCommentPress({showKeyboard: true})}
      activeOpacity={1}
      style={styles.footerButtonLeft}>
      <Text size={13} lineHeight={15} color={flipFlopColors.b30}>
        {I18n.t('posts.footer.comment_button')}
      </Text>
    </TouchableOpacity>
  );

  renderShareAction = ({isPostPage, openShareActionSheet}) => (
    <React.Fragment>
      <TouchableOpacity
        hitSlop={hitSlop}
        onPress={openShareActionSheet}
        activeOpacity={1}
        style={styles.footerButtonRight}>
        <IconButton
          onPress={openShareActionSheet}
          size="small"
          iconSize={14}
          style={styles.shareIcon}
          isAwesomeIcon
          name="share"
          weight="light"
          iconColor="b30"
        />
        <Text size={13} lineHeight={15} color={flipFlopColors.b30}>
          {I18n.t('posts.footer.share_button')}
        </Text>
      </TouchableOpacity>
      {!isPostPage && <View style={styles.separator} />}
    </React.Fragment>
  );

  renderInactiveFooter() {
    const {
      post: {
        payload: {postType},
      },
    } = this.props;
    return (
      <View
        style={[
          styles.footer,
          styles.footerNotInPostPage,
          styles.inactiveFooter,
        ]}>
        <AwesomeIcon
          name="frown"
          color={flipFlopColors.green}
          size={22}
          weight="solid"
        />
        <Text
          size={16}
          lineHeight={20}
          color={flipFlopColors.green}
          style={styles.inactiveText}>
          {I18n.t(`posts.footer.inactive.${postType}`)}
        </Text>
      </View>
    );
  }

  handleCommentPress = ({showKeyboard}) => () => {
    const {
      post: {
        id,
        payload: {postType, templateData, pageId},
      },
    } = this.props;
    if (this.isListItemPassivePostComments()) {
      navigationService.navigate(screenNames.PageView, {
        entityId: pageId,
        reviewId: templateData.entityId,
        showKeyboard,
      });
    } else if (postType === postTypes.RECOMMENDATION) {
      navigationService.navigate(screenNames.PageView, {
        entityId: pageId,
        reviewId: id,
        showKeyboard,
      });
    } else {
      navigationService.navigate(screenNames.PostPage, {
        entityId: id,
        showKeyboard,
      });
    }
  };

  handleThanksOrWelcomeAction = (type) => {
    const {
      post: {id, likes},
    } = this.props;
    const query = {domain: 'posts', key: 'thankedBy', params: {postId: id}};
    const reducerStatePath = `postPage.${id}/thankedBy`;
    const title = I18n.t(`entity_lists.${type}`, {likes});
    navigationService.navigate(screenNames.EntitiesList, {
      query,
      reducerStatePath,
      title,
    });
  };

  isListItemPassivePostComments = () => {
    const {post} = this.props;
    const postType = get(post, 'payload.postType');
    const entityType = get(post, 'payload.templateData.entityType');
    return (
      postType === postTypes.PASSIVE_POST &&
      entityType === entityTypes.LIST_ITEM
    );
  };
}

PostFooter.defaultProps = {
  isPostPage: false,
  isWithoutShare: false,
};

PostFooter.propTypes = {
  isWithoutShare: PropTypes.bool,
  withoutBorderBottom: PropTypes.bool,
  post: PropTypes.object,
  user: userScheme,
  isPostPage: PropTypes.bool,
  footerStyle: stylesScheme,
  originType: PropTypes.oneOf(Object.values(originTypes)),
};

const mapStateToProps = (state) => ({
  user: get(state, 'auth.user', {}),
});

PostFooter = connect(mapStateToProps)(PostFooter);

export default PostFooter;
