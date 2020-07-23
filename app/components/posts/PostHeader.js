import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { apiCommand } from '/redux/apiCommands/actions';
import {
  View,
  Text,
  Avatar,
  TranslatedText,
  DashedBorder,
  InsiderBadge,
} from '../basicComponents';
import {flipFlopColors, commonStyles, flipFlopFontsWeights} from '../../vars';
import {
  entityTypes,
  postTypes,
  screenNamesByEntityType,
  passivePostSubTypes,
  screenNames,
  mediaTypes,
  componentNamesForAnalytics,
} from '../../vars/enums';
import {get, isAppAdmin, getTopUserRole} from '../../infra/utils';
import {numberWithCommas} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {isBoundlessEnabled} from '../../infra/utils/communitiesNationalitiesUtils';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {userScheme, mentionsSchema} from '../../schemas/common';
import {CountryIcon} from '../../components/onboarding';
import PostHeaderAddFriendButton from './PostHeaderAddFriendButton';
import PostHeaderFollowPageButton from './PostHeaderFollowPageButton';
import PostActionSheetButton from './PostActionSheetButton';
import {getPostTimeText} from './utils';

const styles = StyleSheet.create({
  headerWrapper: {
    flex: 1,
    flexDirection: 'column',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingRight: 0,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 5,
  },
  title: {
    paddingRight: 5,
    flex: 1,
  },
  menuButton: {
    width: 28,
    height: 28,
    marginTop: -5,
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerDetailsText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  blackGrayText: {
    fontSize: 15,
    lineHeight: 18,
    color: flipFlopColors.b30,
  },
  regularText: {
    fontSize: 15,
    lineHeight: 18,
    color: flipFlopColors.b70,
  },
  smallText: {
    fontSize: 12,
    lineHeight: 17,
    color: flipFlopColors.b70,
  },
  smallLocationText: {
    fontSize: 12,
    lineHeight: 17,
    color: flipFlopColors.azure,
  },
  contextActionText: {
    fontSize: 13,
    lineHeight: 15,
    color: flipFlopColors.b60,
  },
  contextEntityText: {
    fontSize: 13,
    lineHeight: 15,
    color: flipFlopColors.azure,
  },
  avatar: {
    paddingTop: 1,
  },
  countryIcon: {
    marginRight: 5,
  },
  badge: {
    maxWidth: 130,
    marginRight: -2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: flipFlopFontsWeights.bold,
  },
  editedIcon: {
    fontSize: 12,
    lineHeight: 17,
  },
  contextSeperator: {
    height: 30,
    backgroundColor: flipFlopColors.paleGreyTwo,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  dashedBorder: {
    marginBottom: 5,
  },
  subHeader: {
    flex: 1,
  },
});

class PostHeader extends React.Component {
  constructor(props) {
    super(props);
    const {
      post: {
        payload: {mediaGallery, postType, postSubType},
      },
    } = props;
    this.isPostWithMedia = !!get(mediaGallery, '0.url');
    this.isInstagramConnected =
      postType === postTypes.PASSIVE_POST &&
      postSubType === passivePostSubTypes.INSTAGRAM_CONNECT;
  }

  render() {
    const {
      isPostPage,
      post,
      post: {
        actor,
        context,
        sharedEntity,
        payload: {templateData, postType, postSubType},
        inHood,
      },
      userHood,
      showMenuBtn,
      refreshFeed,
      activeHomeTab,
      screenContextType,
    } = this.props;

    const isEntityCreation = !!(templateData && templateData.entityCreation);
    const isUserInHood = !!(
      userHood &&
      inHood &&
      inHood.some((hood) => hood.neighborhoodId === userHood.id)
    );
    const isPostEntity = !!(
      sharedEntity && sharedEntity.entityType === entityTypes.POST
    );
    const isListEntity = !!(
      sharedEntity && sharedEntity.entityType === entityTypes.LIST
    );
    const isEventEntity = !!(
      sharedEntity && sharedEntity.entityType === entityTypes.EVENT
    );
    const isPageEntity = !!(
      sharedEntity && sharedEntity.entityType === entityTypes.PAGE
    );
    const isItemAddedToList = !!(
      context &&
      context.type === entityTypes.LIST &&
      postSubType === passivePostSubTypes.LIST_ITEM_CREATED
    );
    const isPostInGroupNotInGroupContext =
      context &&
      context.type === entityTypes.GROUP &&
      screenContextType !== entityTypes.GROUP;
    const isPostInEventNotInEventContext =
      context &&
      context.type === entityTypes.EVENT &&
      screenContextType !== entityTypes.EVENT;
    const isPostInNeighborhoodNotInNeighborhoodContext =
      context &&
      context.type === entityTypes.NEIGHBORHOOD &&
      screenContextType !== entityTypes.NEIGHBORHOOD;
    const showContextData =
      postType !== postTypes.SHARE ||
      (sharedEntity.entityType !== entityTypes.POST && isEntityCreation);
    const badgeType = getTopUserRole(actor.roles);

    return (
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Avatar
            style={styles.avatar}
            entityId={actor.id}
            entityType={actor.type}
            name={actor.name}
            themeColor={actor.themeColor}
            thumbnail={actor.media.thumbnail}
            size={'big1'}
          />
          <View style={styles.headerCenter}>
            <View style={styles.titleWrapper}>
              {this.renderTitle({
                isEntityCreation,
                isUserInHood,
                isPostEntity,
                isPostInGroupNotInGroupContext,
                isPostInEventNotInEventContext,
                isPostInNeighborhoodNotInNeighborhoodContext,
              })}
              {showMenuBtn && (
                <PostActionSheetButton
                  style={styles.menuButton}
                  activeHomeTab={activeHomeTab}
                  refreshFeed={refreshFeed}
                  isPostPage={isPostPage}
                  post={post}
                  iconName="more-horizontal"
                />
              )}
            </View>
            <View style={styles.detailsWrapper}>
              <View style={styles.subHeader}>
                {this.renderLocation()}
                {this.renderDetailsText()}
              </View>

              {!!badgeType && (
                <InsiderBadge
                  type={badgeType}
                  style={styles.badge}
                  rolePrefix={actor.rolePrefix}
                  textStyle={styles.badgeText}
                  align="right"
                  tag={get(actor, 'tags[0]')}
                  breakText
                  originEntity={componentNamesForAnalytics.POST}
                />
              )}
            </View>
          </View>
        </View>
        {this.renderPostContext({
          showContextData,
          isEntityCreation,
          isUserInHood,
          isPostEntity,
          isListEntity,
          isEventEntity,
          isPageEntity,
          isItemAddedToList,
          isPostInGroupNotInGroupContext,
          isPostInEventNotInEventContext,
          isPostInNeighborhoodNotInNeighborhoodContext,
        })}
      </View>
    );
  }

  renderTitle = ({
    isEntityCreation,
    isUserInHood,
    isPostEntity,
    isPostInGroupNotInGroupContext,
    isPostInEventNotInEventContext,
    isPostInNeighborhoodNotInNeighborhoodContext,
  }) => {
    const {
      post: {
        actor,
        payload: {postType},
        sharedEntity,
      },
      userHood,
    } = this.props;

    if (postType === postTypes.SHARE) {
      const hasSharedEntityAttribute = !!sharedEntity.entity;
      const sharedEntityPostType = get(
        sharedEntity,
        'entity.post.payload.postType',
      );
      const sharedActorName = get(sharedEntity, 'entity.post.actor.name');
      const isSharedGuide =
        isPostEntity &&
        sharedEntityPostType === postTypes.GUIDE &&
        hasSharedEntityAttribute;
      const action = () =>
        this.navigateToEntityPage({
          entityId: sharedEntity.entityId,
          entityType: sharedEntity.entityType,
        });

      const sharedText = I18n.t('posts.header.shared.shared');
      const createEntityText = I18n.t(
        `posts.header.shared.${sharedEntity.entityType}`,
      );
      return (
        <Text forceLTR style={styles.title}>
          <Text
            style={styles.blackGrayText}
            onPress={() => this.navigateToActorPage(actor)}
            bold>
            {actor.name}
          </Text>
          {!isEntityCreation && (
            <Text style={styles.regularText}>{sharedText}</Text>
          )}
          {isPostEntity && hasSharedEntityAttribute && (
            <TranslatedText
              size={15}
              lineHeight={18}
              color={flipFlopColors.b30}
              onPress={() =>
                this.navigateToEntityPage({
                  entityId: sharedEntity.entityId,
                  entityType: sharedEntity.entityType,
                })
              }
              map={[
                {
                  text: sharedActorName,
                  onPress: () =>
                    this.navigateToActorPage(sharedEntity.entity.post.actor),
                  bold: true,
                },
              ]}>
              {isSharedGuide
                ? I18n.t('posts.header.shared.guide', {name: '%0%'})
                : I18n.t('posts.header.shared.post', {name: '%0%'})}
            </TranslatedText>
          )}
          {!isEntityCreation && !isPostEntity && (
            <Text style={styles.blackGrayText} bold onPress={action}>
              {createEntityText}
            </Text>
          )}
          {!isEntityCreation &&
            isUserInHood &&
            isPostInNeighborhoodNotInNeighborhoodContext && (
              <Text style={styles.regularText}>
                {I18n.t('posts.header.shared.in')}
                <Text
                  style={styles.blackGrayText}
                  onPress={this.navigateToHood}
                  bold>
                  {userHood.name}
                </Text>
              </Text>
            )}
          {!isEntityCreation &&
            (isPostInGroupNotInGroupContext ||
              isPostInEventNotInEventContext) &&
            this.renderSharedToEntityText()}
        </Text>
      );
    } else {
      let navigationFunction = null;
      if (actor.type === entityTypes.USER) {
        navigationFunction = () => this.navigateToUserPage(actor);
      } else if (actor.type === entityTypes.PAGE) {
        navigationFunction = () =>
          this.navigateToEntityPage({
            entityId: actor.id,
            entityType: entityTypes.PAGE,
          });
      }
      return (
        <Text numberOfLines={2} forceLTR style={styles.title}>
          <Text style={styles.blackGrayText} bold onPress={navigationFunction}>
            {actor.name}
          </Text>
        </Text>
      );
    }
  };

  renderSharedToEntityText() {
    const {
      post: {
        context,
        payload: {templateData},
      },
    } = this.props;
    const entityType = I18n.t(
      `entity_type_to_name.${context.type}`,
    ).toLowerCase();
    const sharedToEntityText = I18n.t(
      `posts.header.shared.${
        templateData && templateData.entityCreation ? 'in_entity' : 'to_entity'
      }`,
      {entityType},
    );
    return (
      <Text>
        <Text style={styles.regularText}>{sharedToEntityText}</Text>
        <Text
          style={styles.blackGrayText}
          bold
          onPress={() =>
            this.navigateToEntityPage({
              entityId: context.id,
              entityType: context.type,
            })
          }>
          {context.name}
        </Text>
      </Text>
    );
  }

  renderLocation = () => {
    // const {
    //   post: {
    //     actor,
    //     actor: { friendshipStatus },
    //     communityItem,
    //     payload: { postType },
    //     postLocation
    //   },
    //   user,
    //   apiCommand,
    //   contextCountryCode,
    //   isBoundlessMode
    // } = this.props;
    // const content = [];
    // const separator = (index) => (
    //   <Text style={styles.smallText} key={`separator${index}`}>
    //     {' · '}
    //   </Text>
    // );
    // if (postLocation) {
    //   if (contextCountryCode && isBoundlessMode) {
    //     content.push(<CountryIcon countryCode={contextCountryCode} size={15} style={styles.countryIcon} key="flag" />);
    //   }
    //   content.push([
    //     <Text style={styles.smallLocationText} key="text">
    //       {postLocation}
    //     </Text>
    //   ]);
    // }
    // if (communityItem && actor.type === entityTypes.USER && user.id !== actor.id && postType !== postTypes.SHARE) {
    //   if (postLocation) {
    //     content.push(separator(3));
    //   }
    //   content.push(<PostHeaderAddFriendButton userId={actor.id} userName={actor.name} apiCommand={apiCommand} friendshipStatus={friendshipStatus} postType={postType} key="btn" />);
    // }
    // if (communityItem && actor.type === entityTypes.PAGE && postType !== postTypes.SHARE) {
    //   if (postLocation) {
    //     content.push(separator(3));
    //   }
    //   content.push(<PostHeaderFollowPageButton pageId={actor.id} key="btn2" />);
    // }
    // if (content.length) {
    //   return <View style={styles.headerDetailsText}>{content}</View>;
    // }
    // return null;
  };

  renderPostContextTextAndBorder = ({
    postType,
    actionText,
    entityTypeText,
    onPress,
  }) => {
    if (actionText && entityTypeText) {
      return (
        <View style={[styles.contextSeperator, commonStyles.flex1]}>
          <Text
            numberOfLines={1}
            style={styles.contextActionText}
            ellipsizeMode="tail">
            {actionText}
            <Text
              numberOfLines={1}
              style={styles.contextEntityText}
              onPress={onPress}
              ellipsizeMode="tail">
              {entityTypeText}
            </Text>
          </Text>
        </View>
      );
    }

    if (
      [
        postTypes.RECOMMENDATION,
        postTypes.TIP_REQUEST,
        postTypes.PROMOTION,
      ].includes(postType) &&
      this.isPostWithMedia
    ) {
      return null;
    }
    return <DashedBorder style={styles.dashedBorder} />;
  };

  renderDetailsText = () => {
    const {
      post: {eventTime, edited, injectedPinnedPost, scheduledDate, score},
      user,
    } = this.props;

    if (this.isInstagramConnected) {
      return (
        <Text style={styles.smallText}>
          {I18n.t('posts.header.connect_instagram')}
        </Text>
      );
    }

    const content = [];
    const separator = (index) => (
      <Text style={styles.smallText} key={`separator${index}`}>
        {' · '}
      </Text>
    );
    const isAdmin = isAppAdmin(user);
    const postTimeText = getPostTimeText({eventTime, scheduledDate, user});
    let postTime = postTimeText;
    if (score && isAdmin) {
      const scoreWithCommas = numberWithCommas(score);
      postTime = `${postTimeText} (${scoreWithCommas})`;
    }
    if (postTimeText) {
      content.push(
        <Text style={styles.smallText} key="postTime">
          {postTime}
        </Text>,
      );
    }
    if (injectedPinnedPost) {
      if (postTimeText) {
        content.push(separator(1));
      }
      content.push([
        <AwesomeIcon
          name="thumbtack"
          weight="solid"
          size={12}
          color={flipFlopColors.b70}
          style={styles.editedIcon}
          key="pinnedIcon"
        />,
        <Text style={styles.smallText} key="pinnedText">
          {I18n.t('posts.header.pinned_post')}
        </Text>,
      ]);
    } else if (edited) {
      if (postTimeText) {
        content.push(separator(2));
      }
      content.push([
        <HomeisIcon
          name="edit"
          size={12}
          color={flipFlopColors.b70}
          style={styles.editedIcon}
          key="editedIcon"
        />,
        <Text style={styles.smallText} key="text">
          {I18n.t('posts.header.edited_post')}
        </Text>,
      ]);
    }
    if (content.length) {
      return <View style={styles.headerDetailsText}>{content}</View>;
    }
    return null;
  };

  renderPostContext = ({
    showContextData,
    isEntityCreation,
    isUserInHood,
    isPostEntity,
    isListEntity,
    isEventEntity,
    isPageEntity,
    isItemAddedToList,
    isPostInGroupNotInGroupContext,
    isPostInEventNotInEventContext,
    isPostInNeighborhoodNotInNeighborhoodContext,
  }) => {
    const {
      post: {
        id,
        context,
        sharedEntity,
        payload: {templateData, postType, postSubType, text, media},
      },
      userHood,
    } = this.props;

    let actionText;
    let entityTypeText;
    let onPress;
    const isGuideEntity = postType === postTypes.GUIDE;

    if (showContextData) {
      if (isPostInGroupNotInGroupContext || isPostInEventNotInEventContext) {
        actionText = isPostInGroupNotInGroupContext
          ? I18n.t('posts.header.posted.in_group')
          : I18n.t('posts.header.posted.in_event');
        entityTypeText = context.name;
        onPress = () =>
          this.navigateToEntityPage({
            entityId: context.id,
            entityType: context.type,
            groupType: context.payload && context.payload.groupType,
          });
      } else if (isUserInHood && isPostInNeighborhoodNotInNeighborhoodContext) {
        const isListItemCreated =
          postType === postTypes.PASSIVE_POST &&
          postSubType === passivePostSubTypes.LIST_ITEM_CREATED;
        actionText = isListItemCreated
          ? I18n.t('posts.header.shared.in')
          : I18n.t('feed.post_header.posted_in');
        entityTypeText = userHood.name;
        onPress = this.navigateToHood;
      } else if (
        postType === postTypes.SHARE &&
        isEntityCreation &&
        (isPostEntity || isListEntity || isEventEntity || isPageEntity)
      ) {
        actionText = templateData && I18n.t('posts.header.shared.created');
        entityTypeText = I18n.t(
          `posts.header.shared.${sharedEntity.entityType}`,
        );
        onPress = () =>
          this.navigateToEntityPage({
            entityId: sharedEntity.entityId,
            entityType: sharedEntity.entityType,
          });
      } else if (isGuideEntity) {
        actionText = I18n.t('posts.header.published');
        entityTypeText = I18n.t('posts.header.guide');
        onPress = () =>
          this.navigateToEntityPage({
            entityId: id,
            entityType: entityTypes.POST,
          });
      } else if (isItemAddedToList) {
        actionText = I18n.t('posts.header.added_list_item');
        entityTypeText = context.name;
        onPress = () =>
          this.navigateToEntityPage({
            entityId: context.id,
            entityType: entityTypes.LIST,
          });
      } else if (!text && media && media.type === mediaTypes.IMAGE) {
        return null;
      } else if (
        (postType === postTypes.GIVE_TAKE ||
          postType === postTypes.REAL_ESTATE) &&
        media &&
        media.type === mediaTypes.IMAGE
      ) {
        return null;
      }
    }
    return this.renderPostContextTextAndBorder({
      postType,
      actionText,
      entityTypeText,
      onPress,
    });
  };

  navigateToUserPage = (user) => {
    const {
      id,
      name,
      media: {thumbnail},
      themeColor,
    } = user;
    navigationService.navigateToProfile({
      entityId: id,
      data: {name, thumbnail, themeColor},
    });
  };

  navigateToEntityPage = ({entityId, entityType, groupType}) => {
    navigationService.navigate(screenNamesByEntityType[entityType], {
      entityId,
      groupType,
    });
  };

  navigateToActorPage = (entity) => {
    switch (entity.type) {
      case entityTypes.USER:
        this.navigateToUserPage(entity);
        break;
      case entityTypes.PAGE:
      case entityTypes.GROUP:
        this.navigateToEntityPage({
          entityId: entity.id,
          entityType: entity.type,
        });
        break;
      default:
        break;
    }
  };

  navigateToHood = () => {
    const {userHood} = this.props;

    navigationService.navigate(screenNames.MyNeighborhoodView, {
      neighborhood: userHood,
    });
  };
}

PostHeader.defaultProps = {
  showMenuBtn: true,
};

PostHeader.propTypes = {
  post: PropTypes.shape({
    actor: PropTypes.shape({
      rolePrefix: PropTypes.string,
      id: PropTypes.string,
      thumbnail: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      friendshipStatus: PropTypes.number,
      themeColor: PropTypes.string,
      media: PropTypes.object,
      roles: PropTypes.arrayOf(PropTypes.string),
    }),
    eventTime: PropTypes.string,
    payload: PropTypes.shape({
      postType: PropTypes.oneOf(Object.values(postTypes)),
      text: PropTypes.string,
      image: PropTypes.string,
      mediaGallery: PropTypes.array,
      templateData: PropTypes.object,
      postSubType: PropTypes.string,
      media: PropTypes.object,
    }),
    context: PropTypes.object,
    liked: PropTypes.bool,
    likes: PropTypes.number,
    comments: PropTypes.number,
    mentions: mentionsSchema,
    sharedEntity: PropTypes.shape({
      entityId: PropTypes.string,
      entityType: PropTypes.string,
      entity: PropTypes.object,
    }),
    hasPermissions: PropTypes.array,
    inHood: PropTypes.array,
    id: PropTypes.string,
    scheduledDate: PropTypes.string,
    score: PropTypes.number,
    edited: PropTypes.bool,
    injectedPinnedPost: PropTypes.string,
    postLocation: PropTypes.string,
    communityItem: PropTypes.bool,
  }),
  activeHomeTab: PropTypes.string,
  refreshFeed: PropTypes.func,
  screenContextType: PropTypes.string,
  showMenuBtn: PropTypes.bool,
  user: userScheme,
  userHood: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  isPostPage: PropTypes.bool,
  //   apiCommand: PropTypes.func,
  contextCountryCode: PropTypes.number,
  isBoundlessMode: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  user: get(state, 'auth.user', {}),
  userHood: get(state, 'auth.user.journey.neighborhood', null),
  contextCountryCode: get(ownProps, 'post.actor.contextCountryCode[0]'),
  isBoundlessMode: isBoundlessEnabled(get(state, 'auth.user.nationalityGroup')),
});

const mapDispatchToProps = {
  //   apiCommand
};

PostHeader = connect(mapStateToProps, mapDispatchToProps)(PostHeader);
export default PostHeader;
