import {
  omit,
  omitBy,
  isEmpty,
  isNil,
  differenceObject,
  memoize,
} from '../../infra/utils';
import {FloatingHeader} from '../basicComponents';

const breakpoint = FloatingHeader.getAdjustedBreakpoint();

export const hasActiveFilters = memoize(
  ({filters, filtersObjToExclude = {}, ignoreFilters = []}) => {
    const activeFilters = omitBy(filters, isNil);
    return !isEmpty(
      omit(differenceObject(activeFilters, filtersObjToExclude), ignoreFilters),
    );
  },
);

export const shouldShowFloatingHeader = ({
  contentYOffset,
  prevShowFloatingHeader,
}) => {
  if (contentYOffset > breakpoint && !prevShowFloatingHeader) {
    return true;
  } else if (contentYOffset < breakpoint && prevShowFloatingHeader) {
    return false;
  }

  return null;
};

export function getFiltersScrollYOffset(event) {
  return event.nativeEvent.layout.y - breakpoint;
}
