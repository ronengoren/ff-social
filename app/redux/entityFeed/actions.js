export const ADD_POST = 'ENTITY_FEED/ADD_POST';

export const getEntityFeedInfiniteScrollProps = ({ entityId }) => ({
  apiQuery: { domain: 'feed', key: 'entity', params: { id: entityId } },
  reducerStatePath: `entityFeed.${entityId}`
});
