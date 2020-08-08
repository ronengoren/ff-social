import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { analytics } from '/infra/reporting';
import {openActionSheet} from '../redux/general/actions';
import {
  postTypes,
  editModes,
  screenNames,
  entityTypes,
  groupPrivacyType,
  shareableTypes,
  originTypes,
  componentNamesForAnalytics,
  listViewTypes,
} from '../vars/enums';
import {shareActionSheetDefinition} from '../common/actionsheets';
import {navigationService} from '../infra/navigation';
import {get} from '../infra/utils';

class Shareable extends React.Component {
  static wrapWithSharedPostData = ({entity, entityType}) => {
    const {id: entityId} = entity || {};

    return {
      payload: {postType: postTypes.SHARE},
      sharedEntity: {entityId, entityType},
      sharedEntityType: entityType,
      ...entity,
    };
  };

  render = () => {
    const {children} = this.props;
    const {data, actionSheet} = this.getShareActionData();
    return children({
      data,
      actionSheet,
      shouldShowShare: this.shouldShowShare(),
      openShareActionSheet: this.openShareActionSheet,
    });
  };

  // TODO: Used from feed, entity actions, etc, should be refactored and removed in the near future
  getSharedDataForEntity = () => {
    const {entity} = this.props;
    const {payload, sharedEntity} = entity;
    const isSharedPost = payload.postType === postTypes.SHARE;
    const actualEntity = get(sharedEntity, 'entity') || entity;

    if (isSharedPost && sharedEntity.entityType === entityTypes.POST) {
      const postEntity = get(sharedEntity, 'entity.post') || actualEntity;
      return postEntity;
    }

    if (isSharedPost && sharedEntity.entityType === entityTypes.PAGE) {
      const pageEntity = get(sharedEntity, 'entity.page') || actualEntity;
      return pageEntity;
    }

    return actualEntity;
  };

  // TODO: Refactor, remove all this nonsense
  navigateToPostEditor = () => {
    const {entity, userNeighborhood} = this.props;
    const {payload} = entity;
    const isShareOfSharedPost = payload.postType === postTypes.SHARE;
    const sharedEntity = this.getSharedDataForEntity();

    const editorParams = {
      mode: editModes.CREATE,
      postData: {payload: {postType: postTypes.SHARE}},
      sharedEntity,
      sharedEntityType: isShareOfSharedPost
        ? entity.sharedEntity.entityType
        : sharedEntity.sharedEntityType || entityTypes.POST,
    };

    if (userNeighborhood) {
      editorParams.additionalContexts = [
        {...userNeighborhood, entityType: entityTypes.NEIGHBORHOOD},
      ];
    }

    navigationService.navigate(screenNames.PostEditor, editorParams);
  };

  getShareActionData = () => {
    const {entity, originType, componentName} = this.props;
    const {
      payload: {postType, title} = {},
      sharedEntity,
      id,
      name,
      actor,
      context,
      creator,
      hosts,
      sharedEntityType,
      tags,
      urlSlug,
    } = entity;

    const sharedEntityActualUrlSlug =
      get(sharedEntity, 'entity.urlSlug') ||
      get(sharedEntity, 'entity.page.urlSlug');
    const actualEntityUrlSlug = sharedEntityActualUrlSlug || urlSlug;
    const data = {
      actorId: get(actor, 'id') || get(creator, 'id') || get(hosts, '[0].id'),
      actorName:
        get(actor, 'name') || get(creator, 'name') || get(hosts, '[0].name'),
      entityType:
        get(sharedEntity, 'entityType') ||
        get(entity, 'entityType') ||
        entityTypes.POST,
      entitySubType: postType || sharedEntityType,
      entityId: get(sharedEntity, 'entityId') || id,
      entityName:
        get(sharedEntity, 'entity.name') ||
        get(sharedEntity, 'entity.page.creator.name') ||
        name ||
        title ||
        get(actor, 'name') ||
        get(context, 'name'),
      creatorName:
        get(creator, 'name') || get(actor, 'name') || get(hosts, '[0].name'),
      creatorId: get(creator, 'id') || get(actor, 'id') || get(hosts, '[0].id'),
      themes: tags,
      screenCollection: originType,
      componentName,
      urlSlug: actualEntityUrlSlug,
    };

    const actionSheet = shareActionSheetDefinition({
      ...data,
      navigateToPostEditor: this.navigateToPostEditor,
    });

    return {data, actionSheet};
  };

  openShareActionSheet = () => {
    const {openActionSheet, entity} = this.props;
    const {payload: {postType} = {}} = entity;
    const {data, actionSheet} = this.getShareActionData();
    // analytics.actionEvents.clickedShareAction(data).dispatch();

    if (shareableTypes.includes(data.entityType || postType)) {
      openActionSheet(actionSheet);
    } else {
      this.navigateToPostEditor();
    }
  };

  shouldShowShare = () => {
    const {
      entity,
      entity: {context: {payload, type} = {}, payload: {postType} = {}},
    } = this.props;

    const isListPoll =
      get(entity, 'sharedEntity.entity.viewType') === listViewTypes.POLL;
    if (isListPoll) {
      return false;
    }

    if ([entityTypes.GROUP, entityTypes.EVENT].includes(type)) {
      return !payload || payload.privacyType !== groupPrivacyType.PRIVATE;
    }

    return ![
      postTypes.PASSIVE_POST,
      postTypes.ACTIVATION,
      postTypes.INTRODUCTION,
    ].includes(postType);
  };
}

Shareable.propTypes = {
  children: PropTypes.func,
  userNeighborhood: PropTypes.object,
  entity: PropTypes.object,
  openActionSheet: PropTypes.func,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  componentName: PropTypes.oneOf(Object.values(componentNamesForAnalytics)),
};

const mapDispatchToProps = {
  openActionSheet,
};

const mapStateToProps = (state) => ({
  userNeighborhood: get(state, 'auth.user.journey.neighborhood'),
});

Shareable = connect(mapStateToProps, mapDispatchToProps)(Shareable);
export default Shareable;
