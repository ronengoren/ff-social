export const LIKED_SUGGESTED_ITEM = 'LIKED_SUGGESTED_ITEM';

export const likeSuggestedItem = ({ transformer, suggestedItemType }) => ({
  type: LIKED_SUGGESTED_ITEM,
  transformer,
  payload: { suggestedItemType }
});
