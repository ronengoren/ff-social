import React, {Component} from 'react';
import {denormalize, constructDenormalizedData} from '/redux/normalizer';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {get} from '../../infra/utils';
import {entityTypes, originTypes} from '../../vars/enums';
import {EntityCompactView} from '../../components/entity';

class ThemeEntityItem extends Component {
  render() {
    const {
      entity,
      entityType,
      entityId,
      sharedEntity,
      sharedEntityType,
      sharedEntityId,
      sharedEntityPost,
      index,
      hoodContext,
    } = this.props;
    const data = constructDenormalizedData({
      entity,
      entityType,
      entityId,
      sharedEntity,
      sharedEntityType,
      sharedEntityId,
      sharedEntityPost,
    });

    const nestedEntityPage = get(data, 'entity.payload.page');
    if (nestedEntityPage) {
      // Currently in home tab themes view - instead of getting pages (like in user's themes) we get a post/list item with page as the payload.
      // But we need to show it like page with a context
      const {savers, saves, saved} = data.entity;
      const adjustedData = {
        ...nestedEntityPage,
        saves: savers,
        totalSaves: saves,
        saved,
      };
      return (
        <EntityCompactView
          data={adjustedData}
          entityType={entityTypes.PAGE}
          context={data}
          index={index}
          isThemePage
          hoodContext={hoodContext}
          originType={originTypes.THEME_VIEW}
        />
      );
    } else {
      const postType =
        data.entityType === entityTypes.POST
          ? data.entity.payload.postType
          : null;
      return (
        <EntityCompactView
          data={data.entity}
          entityType={data.entityType}
          postType={postType}
          context={data.context}
          index={index}
          isThemePage
          hoodContext={hoodContext}
          originType={originTypes.THEME_VIEW}
        />
      );
    }
  }
}

ThemeEntityItem.propTypes = {
  entity: PropTypes.object,
  entityType: PropTypes.string,
  entityId: PropTypes.string,
  sharedEntity: PropTypes.object,
  sharedEntityType: PropTypes.string,
  sharedEntityId: PropTypes.string,
  sharedEntityPost: PropTypes.object,
  hoodContext: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  index: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const {
    entity,
    entityType,
    entityId,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
  } = denormalize({dataProp: ownProps.data, state});

  return {
    entity,
    entityType,
    entityId,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
  };
};

export default connect(mapStateToProps)(ThemeEntityItem);
