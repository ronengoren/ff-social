import {setClipboardHomeisWebLink} from '../../infra/utils/linkingUtils';
import I18n from '../../infra/localization';
import {
  editModes,
  screenNames,
  entityTypes,
  userPermissions,
  postTypes,
} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {flipFlopColors} from '../../vars';
import {getAddStoryDefinition} from '/screens/homeTab/stories/utils';

const postActionSheetDefinition = ({
  contextEntityId,
  contextEntityType,
  contextEntityName,
  publishAs,
  deletePostMode,
  onReport,
  enterDeleteMode,
  deletePost,
  post,
  hasPermissions,
  activeHomeTab,
  onHidePinnedPost,
  onHighlight,
  onDehighlight,
  onPin,
  onUnpin,
  onBoostUp,
  onBoostDown,
  type,
  canReportBadContent,
  canAddToStory,
}) => () => {
  let options;
  let header = null;
  const sharedEntityType = get(post, 'sharedEntity.entityType');
  const isGuide = post.payload.postType === postTypes.GUIDE;
  let entityPath;
  switch (sharedEntityType) {
    case entityTypes.POST:
      entityPath = 'sharedEntity.entity.post';
      break;
    case entityTypes.PAGE:
      entityPath = 'sharedEntity.entity.page';
      break;
    case entityTypes.GROUP:
    case entityTypes.EVENT:
    default:
      entityPath = 'sharedEntity.entity';
  }
  const sharedEntity = get(post, entityPath);
  const {scheduledDate, urlSlug} = post;

  if (deletePostMode) {
    const {removeFromFeedOnly} = deletePostMode;

    header = isGuide
      ? {
          text: I18n.t(
            `posts.action_sheets.${
              removeFromFeedOnly
                ? 'delete_guide_from_feed_title'
                : 'delete_guide_title'
            }`,
          ),
        }
      : {
          text: I18n.t(
            `posts.action_sheets.${
              removeFromFeedOnly ? 'delete_from_feed_title' : 'delete_title'
            }`,
          ),
        };
    options = [
      {
        id: 'delete',
        text: I18n.t('posts.action_sheets.delete_confirm'),
        shouldClose: true,
        action: () => deletePost(removeFromFeedOnly),
        testID: 'deletePostConfirmBtn',
      },
    ];
  } else if (hasPermissions && hasPermissions.length > 0) {
    options = [];

    if (onBoostUp) {
      const boostUpText = I18n.t('posts.action_sheets.boost_up', {
        contentQuality: post.cq,
      });
      options.push({
        id: 'boostUp',
        text: boostUpText,
        awesomeIconName: 'arrow-to-top',
        shouldClose: true,
        action: onBoostUp,
      });
    }

    if (onBoostDown) {
      const boostDownText = I18n.t('posts.action_sheets.boost_down', {
        contentQuality: post.cq,
      });
      options.push({
        id: 'boostDown',
        text: boostDownText,
        awesomeIconName: 'arrow-to-bottom',
        shouldClose: true,
        action: onBoostDown,
      });
    }

    if (hasPermissions.includes(userPermissions.EDIT)) {
      options.push({
        id: 'edit',
        text: I18n.t('posts.action_sheets.edit'),
        iconName: 'edit',
        shouldClose: true,
        action: () =>
          navigationService.navigate(screenNames.PostEditor, {
            mode: editModes.EDIT,
            postData: post,
            sharedEntity,
            sharedEntityType,
            activeHomeTab,
            contextEntityId,
            contextEntityType,
            contextEntityName,
            publishAs,
            type,
          }),
      });
    }

    if (hasPermissions.includes(userPermissions.HIGHLIGHT) && onHighlight) {
      const pinText =
        post.context.type === 'group'
          ? I18n.t('posts.action_sheets.highlight_post.group')
          : I18n.t('posts.action_sheets.highlight_post.page');
      const unpinText =
        post.context.type === 'group'
          ? I18n.t('posts.action_sheets.dehighlight_post.group')
          : I18n.t('posts.action_sheets.dehighlight_post.page');
      if (
        post.highlighted ||
        (post.sharedEntity && post.sharedEntity.highlighted)
      ) {
        options.push({
          id: 'removeHighlight',
          text: unpinText,
          iconName: 'close',
          shouldClose: true,
          action: onDehighlight,
        });
      } else {
        options.push({
          id: 'highlight',
          text: pinText,
          iconName: 'star',
          shouldClose: true,
          action: onHighlight,
        });
      }
    }

    if (hasPermissions.includes(userPermissions.PIN_POST) && onPin) {
      const pinText =
        post.context.type === 'group'
          ? I18n.t('posts.action_sheets.pin_post.group')
          : I18n.t('posts.action_sheets.pin_post.page');
      const unpinText =
        post.context.type === 'group'
          ? I18n.t('posts.action_sheets.unpin_post.group')
          : I18n.t('posts.action_sheets.unpin_post.page');
      if (post.pinned) {
        options.push({
          id: 'unpin',
          text: unpinText,
          iconName: 'close',
          shouldClose: true,
          action: onUnpin,
        });
      } else {
        options.push({
          id: 'pin',
          text: pinText,
          awesomeIconName: 'thumbtack',
          shouldClose: true,
          action: onPin,
        });
      }
    }

    if (hasPermissions.includes(userPermissions.DELETE) && enterDeleteMode) {
      if (isGuide) {
        if (!scheduledDate) {
          options.push({
            id: 'delete_from_feed',
            text: I18n.t('posts.action_sheets.delete_guide_from_feed'),
            iconName: 'delete',
            shouldClose: false,
            action: () => enterDeleteMode(true),
            color: flipFlopColors.red,
            testID: 'deleteGuideFeedPostBtn',
          });
        }

        options.push({
          id: 'delete',
          text: I18n.t('posts.action_sheets.delete_guide'),
          iconName: 'delete',
          shouldClose: false,
          action: enterDeleteMode,
          color: flipFlopColors.red,
          testID: 'deleteGuidePostBtn',
        });
      } else {
        options.push({
          id: 'delete',
          text: I18n.t('posts.action_sheets.delete'),
          iconName: 'delete',
          shouldClose: false,
          action: enterDeleteMode,
          color: flipFlopColors.red,
          testID: 'deletPostBtn',
        });
      }
    }

    if (canReportBadContent) {
      options.push({
        id: 'report',
        text: I18n.t('posts.action_sheets.report.button'),
        iconName: 'flag',
        shouldClose: false,
        action: onReport,
      });
    }
  } else {
    options = [
      {
        id: 'report',
        text: I18n.t('posts.action_sheets.report.button'),
        iconName: 'flag',
        shouldClose: false,
        action: onReport,
      },
    ];

    if (post.injectedPinnedPost) {
      options.unshift({
        id: 'hide',
        text: I18n.t('posts.action_sheets.hide'),
        iconName: 'private',
        shouldClose: true,
        action: onHidePinnedPost,
      });
    }
    if (isGuide) {
      options.push({
        id: 'link',
        text: 'Copy Link',
        awesomeIconName: 'link',
        shouldClose: true,
        action: () =>
          setClipboardHomeisWebLink({
            urlSlug,
            entityType: entityTypes.POST,
            entityId: post.id,
          }),
      });
    }
  }

  if (canAddToStory) {
    options.unshift(
      getAddStoryDefinition({data: post, entityType: entityTypes.POST}),
    );
  }

  return {
    header,
    options,
    hasCancelButton: true,
  };
};

export default postActionSheetDefinition;
