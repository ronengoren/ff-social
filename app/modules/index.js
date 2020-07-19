import {schema} from 'normalizr';

export const list = new schema.Entity('lists');
export const group = new schema.Entity('groups');
export const event = new schema.Entity('events');
export const post = new schema.Entity('posts');
const sharedEntity = new schema.Union(
  {
    list,
    group,
    post: {
      post,
    },
  },
  (value, parent) => parent.entityType,
);

export const feedPost = new schema.Entity('posts', {
  sharedEntity: {
    entity: sharedEntity,
  },
});

const mixedTypeEntity = new schema.Union(
  {
    list,
    post,
    group,
  },
  (value, parent) => parent.entityType,
);

export const mixedTypeEntities = new schema.Object({
  entity: mixedTypeEntity,
});
