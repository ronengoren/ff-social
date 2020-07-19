import I18n from '../../infra/localization';
import {get, set} from '../../infra/utils';

export function reduceNestedStateRecursion(obj, keysArr, reducer) {
  const currentKey = keysArr[0];
  const restKeyArr = keysArr.slice(1, keysArr.length);

  if (currentKey) {
    if (obj) {
      return {
        ...obj,
        [currentKey]: reduceNestedStateRecursion(
          obj[currentKey],
          restKeyArr,
          reducer,
        ),
      };
    }
    return {[currentKey]: reduceNestedStateRecursion({}, restKeyArr, reducer)};
  }
  return reducer(obj);
}

export const shuffleArray = (array) => {
  if (!array || !array.length) {
    return [];
  }
  const copiedArr = JSON.parse(JSON.stringify(array));
  for (let i = copiedArr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArr[i], copiedArr[j]] = [copiedArr[j], copiedArr[i]];
  }
  return copiedArr;
};

export const pluralTranslateWithZero = (count, translationPath, params = {}) =>
  I18n.t(`${translationPath}.${count}`, {
    defaultValue: I18n.t(`${translationPath}.default`, {count, ...params}),
    ...params,
  });

export const getUpdatedVotesForItem = ({item, voted, voter}) => {
  const updatedItem = {
    ...item,
    voted,
    totalVotes: item.totalVotes + (voted ? 1 : -1),
  };
  if (item.voters) {
    updatedItem.voters = voted
      ? [voter, ...item.voters]
      : item.voters.filter((actor) => actor.id !== voter.id);
  }
  return updatedItem;
};

export const appendInfiniteScrollPropsToPostWithItems = ({post, data}) =>
  set(post, 'sharedEntity.entity.items', {
    data,
    hasMore: data.length < get(post, 'sharedEntity.entity.totalItems'),
    page: 1,
    loading: false,
    loaded: true,
  });
