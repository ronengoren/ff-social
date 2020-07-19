import {
  clone,
  capitalize,
  cloneDeep,
  sortBy,
  isEqual,
  startCase,
  chunk,
  get,
  head,
  isNil,
  isNumber,
  invert,
  uniq,
  uniqBy,
  uniqWith,
  merge,
  intersection,
  compact,
  uniqueId,
  keyBy,
  mapValues,
  debounce,
  pick,
  pickBy,
  memoize,
  random,
  isEmpty,
  omit,
  pull,
  set,
  sumBy,
  remove,
  isObject,
  isUndefined,
  isBoolean,
  omitBy,
  transform,
  without,
  xor,
  unescape,
} from 'lodash';
import React from 'react';
import {
  userTypes,
  userRoleTypes,
  pageRoleTypes,
  entityTypes,
} from '../../vars/enums';

export function getFilePathFromLocalUri(localUri) {
  return localUri.replace('file:///', '');
}

export const intersectList = (originalDataList, newDataList) => {
  if (!originalDataList || !originalDataList.length) {
    return newDataList;
  }
  if (!newDataList || !newDataList.length) {
    return originalDataList;
  }
  const originalIds = {};
  originalDataList.forEach((item) => {
    if (isObject(item)) {
      const id = item.entityId || item.id;
      originalIds[id] = true;
    } else {
      originalIds[item] = true;
    }
  });

  const filteredNewDataList = newDataList.filter((item) =>
    isObject(item) ? !originalIds[item.id] : !originalIds[item],
  );
  return [...originalDataList, ...filteredNewDataList];
};

export const appendQueryParam = (uri, key, value) => {
  if (!value) {
    return uri;
  } else {
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    return `${uri}${separator}${key}=${value}`;
  }
};

export function canChangeCountryPicker(user, publishAs) {
  const isAdmin = isAppAdmin(user);
  const userRoles = get(user, 'roles') || [];
  const pageRoles = get(publishAs, 'roles') || [];
  const isRegionalManager = userRoles.includes(userRoleTypes.REGIONAL_MANAGER);
  const isExpert = pageRoles.includes(pageRoleTypes.EXPERT);
  return isAdmin || isRegionalManager || isExpert;
}

export function dropTestIdFromChildren(children) {
  return React.Children.map(children, (child) => {
    let childProps = child.props;
    if (child.props.testID) {
      childProps = clone(child.props);
      childProps.testID = Math.random().toString();
      return React.cloneElement(child, childProps);
    } else {
      return child;
    }
  });
}

export const deleteObjectPropFromArrayOfObjects = ({arr, propName}) => {
  if (arr && arr.length) {
    const retVal = arr.map((obj) => {
      if (obj[propName]) {
        const tmp = {...obj};
        delete tmp[propName];
        return tmp;
      }
      return obj;
    });
    return retVal;
  }
  return null;
};

export const getKeyByValue = (obj, value) =>
  Object.keys(obj).find((key) => obj[key] === value);

export const arrayToStringByKey = ({array, key}) =>
  array.reduce((total, current) => total + current[key], '');

export async function delayInMilliseconds(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export const isAppAdmin = (user) =>
  [userTypes.ADMIN, userTypes.SUPER_ADMIN].includes(user.userType);

export const isSuperAdmin = (user) => user.userType === userTypes.SUPER_ADMIN;

export function isRegionalOrNationalManager(user) {
  const userRoles = get(user, 'roles') || [];
  return [
    userRoleTypes.NATIONAL_MANAGER,
    userRoleTypes.REGIONAL_MANAGER,
  ].some((role) => userRoles.includes(role));
}

export function isPageExpert(publishAs) {
  const publishAsRoles = get(publishAs, 'roles') || [];
  return publishAsRoles.includes(pageRoleTypes.EXPERT);
}

export function isPageManager(publishAs) {
  const isPagePublisher = get(publishAs, 'type') === entityTypes.PAGE;
  const isPageOwner =
    !!get(publishAs, 'ownedByYou') || !!get(publishAs, 'isOwner');
  return isPagePublisher && isPageOwner;
}

export const getTopUserRole = (roles) => {
  if (roles) {
    if (roles.includes(userRoleTypes.NATIONAL_MANAGER)) {
      return userRoleTypes.NATIONAL_MANAGER;
    }
    if (roles.includes(userRoleTypes.REGIONAL_MANAGER)) {
      return userRoleTypes.REGIONAL_MANAGER;
    }
    if (roles.includes(pageRoleTypes.EXPERT)) {
      return pageRoleTypes.EXPERT;
    }
  }
  return null;
};

export const shouldRestrictPostTypes = (user, publishAs = {}) =>
  !isAppAdmin(user) &&
  !isRegionalOrNationalManager(user) &&
  !isPageExpert(publishAs) &&
  !isPageManager(publishAs);

export function differenceObject(object, base) {
  const changes = (object, base) =>
    transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        // eslint-disable-next-line no-param-reassign
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  return changes(object, base);
}

function capitalizeWithoutFormattingRestOfText(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isArraysContainsTheSameElements(firstArray, secondArray) {
  return isEmpty(xor(firstArray, secondArray));
}

export {
  clone,
  capitalize,
  chunk,
  sortBy,
  cloneDeep,
  isNil,
  isNumber,
  invert,
  omit,
  isEqual,
  get,
  head,
  uniq,
  uniqBy,
  uniqWith,
  merge,
  intersection,
  compact,
  uniqueId,
  keyBy,
  mapValues,
  debounce,
  pick,
  pickBy,
  memoize,
  random,
  isEmpty,
  pull,
  set,
  sumBy,
  remove,
  isObject,
  isUndefined,
  isBoolean,
  omitBy,
  startCase,
  without,
  capitalizeWithoutFormattingRestOfText,
  isArraysContainsTheSameElements,
  xor,
  unescape,
};
