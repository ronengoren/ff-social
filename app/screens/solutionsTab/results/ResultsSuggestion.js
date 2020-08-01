import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {plural} from 'pluralize';
import I18n from '../../../infra/localization';
import {get, isEmpty} from '../../../infra/utils';
import {addSpaceOnCapitalsAndCapitalize} from '../../../infra/utils/stringUtils';
import {ItemErrorBoundary, InfiniteScroll} from '../../../components';
import {View, Spinner, InsiderBadge} from '../../../components/basicComponents';
import {CarouselItem} from '../../../components/entityCarousel';
import SuggestedItemsRender from '../../../components/feed/suggestedItems/SuggestedItemsRender';
import {
  suggestedSolutionsTypes,
  originTypes,
  componentNamesForAnalytics,
  pageRoleTypes,
} from '../../../vars/enums';
import {flipFlopColors, flipFlopFontsWeights} from '../../../vars';
import {solutionScheme} from '../../../schemas/common';
import {getSolutionDataForAnalytics} from '../utils';

const styles = StyleSheet.create({
  carousel: {
    width: 200,
    height: 215,
    marginBottom: 25,
  },
  header: {
    marginBottom: 5,
  },
  spinner: {
    marginHorizontal: 10,
  },
  badge: {
    position: 'absolute',
    top: 95,
    left: -2,
  },
  badgeText: {
    lineHeight: 12,
    fontWeight: flipFlopFontsWeights.bold,
  },
});

const getEntityType = {
  [suggestedSolutionsTypes.SUGGESTED_EXPERTS]: 'page',
  [suggestedSolutionsTypes.SUGGESTED_LISTS]: 'list',
  [suggestedSolutionsTypes.SUGGESTED_GUIDES]: 'post',
  [suggestedSolutionsTypes.SUGGESTED_GROUPS]: 'group',
  [suggestedSolutionsTypes.SUGGESTED_COMMUNITY_POSTS]: 'post',
};

function ResultsSuggestion(props) {
  const {type, originType, solution, query, reducerStatePath} = props;
  const {id: solutionId} = solution;
  const entityType = getEntityType[type];
  const {data = [], isFetchingBottom} = useSelector((state) =>
    get(state, reducerStatePath, {}),
  );
  const header =
    type === suggestedSolutionsTypes.SUGGESTED_GUIDES
      ? I18n.t(`solutions.results.carousels.guides`, {
          defaultValue: addSpaceOnCapitalsAndCapitalize(plural(entityType)),
        })
      : I18n.t(`solutions.results.carousels.${plural(entityType)}`, {
          defaultValue: addSpaceOnCapitalsAndCapitalize(plural(entityType)),
        });

  if (isEmpty(data)) {
    return null;
  }

  const renderBadge = (data) =>
    type === suggestedSolutionsTypes.SUGGESTED_EXPERTS &&
    data.roles.includes(pageRoleTypes.EXPERT) && (
      <InsiderBadge
        tag={get(data, 'tags[0]')}
        type={pageRoleTypes.EXPERT}
        style={styles.badge}
        textStyle={styles.badgeText}
        size={9}
        iconSize={18}
        preventPress
      />
    );

  return (
    <View>
      <View style={styles.header}>
        <SuggestedItemsRender.Header header={header} />
      </View>
      <InfiniteScroll
        horizontal
        disableInitialFetch
        showRefreshingSpinner={false}
        extraBottomComponent={
          isFetchingBottom && (
            <Spinner
              style={styles.spinner}
              size="large"
              color={flipFlopColors.green}
            />
          )
        }
        ListItemComponent={({data, index}) => (
          <ItemErrorBoundary key={data.id} boundaryName="CarouselItem">
            <CarouselItem
              carouselId={solutionId}
              carouselType={type}
              item={data}
              itemNumber={index}
              entityType={entityType}
              originType={originType}
              componentName={componentNamesForAnalytics.CAROUSEL}
              fireAnalyticsEvents
              size={CarouselItem.sizes.MEDIUM}
              shouldRenderActions={false}
              shouldRenderBreadcrumbs={false}
              style={styles.carousel}
              extraAnalyticsData={getSolutionDataForAnalytics(solution)}
              renderComponent={renderBadge(data)}
            />
          </ItemErrorBoundary>
        )}
        apiQuery={query}
        reducerStatePath={reducerStatePath}
        normalizedSchema="MIXED_TYPE_ENTITIES"
      />
    </View>
  );
}

ResultsSuggestion.propTypes = {
  solution: solutionScheme,
  reducerStatePath: PropTypes.string,
  query: PropTypes.object,
  type: PropTypes.oneOf(Object.values(suggestedSolutionsTypes)),
  originType: PropTypes.oneOf(Object.values(originTypes)),
};

ResultsSuggestion.defaultProps = {
  originType: originTypes.SOLUTIONS_TAB,
};

export default ResultsSuggestion;
