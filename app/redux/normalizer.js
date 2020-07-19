import {normalize} from 'normalizr';
import {
  feedPost,
  list,
  group,
  post,
  event,
  mixedTypeEntities,
} from '../modules';
import {get} from '../infra/utils';

export const ADD_ENTITIES = 'ADD_ENTITIES';

const dispatchAddEntities = ({data, dispatch}) => {
  dispatch({
    type: ADD_ENTITIES,
    payload: {
      data: data.entities,
    },
  });
};

const modules = {
  FEED: feedPost,
  LISTS: list,
  GROUPS: group,
  EVENTS: event,
  POSTS: post,
  MIXED_TYPE_ENTITIES: mixedTypeEntities,
};

export const handleNormalizedData = ({data, normalizedSchema, dispatch}) => {
  let dataToUpdate = data;
  if (normalizedSchema) {
    dataToUpdate = normalize(data, [modules[normalizedSchema]]); // Handles currently only the case of an array
    dispatchAddEntities({data: dataToUpdate, dispatch});
    dataToUpdate = dataToUpdate.result;
  }

  return dataToUpdate;
};

export const denormalize = ({dataProp, state}) => {
  let data =
    typeof dataProp === 'string'
      ? state.posts.byId[dataProp] ||
        state.lists.byId[dataProp] ||
        state.groups.byId[dataProp] ||
        state.events.byId[dataProp] ||
        dataProp
      : dataProp;
  let entityType;
  let entityId;
  let sharedEntity;
  let sharedEntityType;
  let sharedEntityId;
  let sharedEntityPost;

  const sharedEntityschema = get(data, 'sharedEntity.entity.schema');
  if (sharedEntityschema) {
    const {id} = data.sharedEntity.entity;
    if (typeof id === 'object') {
      sharedEntityType = data.sharedEntity.entityType;
      sharedEntityId = data.sharedEntity.entityId;
      sharedEntity = data.sharedEntity.entity.id;
      sharedEntityPost = state[`${sharedEntityschema}s`].byId[sharedEntityId];
    } else {
      sharedEntityType = data.sharedEntity.entityType;
      sharedEntityId = data.sharedEntity.entityId;
      sharedEntity = state[`${sharedEntityschema}s`].byId[id];
    }
  }

  const entitySchema = get(data, 'entity.schema');
  if (entitySchema) {
    ({entityType, entityId} = data);
    data = state[`${entitySchema}s`].byId[entityId];
  }

  if (data.schema) {
    data = state[`${data.schema}s`].byId[data.id];
  }
  return {
    entity: data,
    entityType,
    entityId,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
  };
};

export const constructDenormalizedData = ({
  entity,
  entityType,
  entityId,
  sharedEntity,
  sharedEntityType,
  sharedEntityId,
  sharedEntityPost,
}) => {
  let data;
  if (entityType) {
    data = {entity, entityType, entityId};
  } else {
    data = {...entity};
  }

  if (sharedEntity) {
    data.sharedEntity = {
      entity: {...sharedEntity},
      entityType: sharedEntityType,
      entityId: sharedEntityId,
      highlighted: entity.sharedEntity.highlighted,
    };

    if (sharedEntityPost) {
      data.sharedEntity.entity.post = sharedEntityPost;
    }
  }

  return data;
};
