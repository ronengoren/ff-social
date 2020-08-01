import React, {useRef, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Animated, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ItemErrorBoundary} from '../../../components';
import I18n from '../../../infra/localization';
import {View, ScrollView, Spinner} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles, uiConstants} from '../../../vars';
import {get, isEmpty} from '../../../infra/utils';
import {suggestedSolutionsTypes} from '../../../vars/enums';
import {GenericEmptyState} from '../../../components/emptyState';
import {AwesomeIcon} from '../../../assets/icons';
import {useAnimation} from '/hooks';
import {
  getSolutionsCarousel,
  removeSolutionsCarrousel,
} from '../../../redux/solutions/actions';
import {solutionScheme} from '../../../schemas/common';

import ResultsSuggestion from './ResultsSuggestion';
import {getParamsByType} from '../utils';

const {height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  suggestedEntitiesCarousels: {
    paddingTop: 10,
    paddingLeft: 5,
  },
  fullHeightCenteredContainer: {
    height: height / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCarouselsIconAfterAnimation: {
    position: 'absolute',
    left: -22,
    top: 0,
  },
  paddingBottomSpacer: {
    paddingBottom: uiConstants.BOTTOM_TAB_BAR_HEIGHT,
  },
});

const EmptyIconWithAnimation = ({opacity}) => (
  <View style={commonStyles.flexDirectionRow}>
    <Animated.View style={{opacity}}>
      <AwesomeIcon
        style={styles.emptyCarouselsIconAfterAnimation}
        name="lightbulb-on"
        color={flipFlopColors.green}
        size={80}
        weight="light"
      />
    </Animated.View>
    <AwesomeIcon
      name="lightbulb"
      color={flipFlopColors.b60}
      size={80}
      weight="light"
    />
  </View>
);
EmptyIconWithAnimation.propTypes = {
  opacity: PropTypes.number,
};

const EmptyCarousels = React.memo(() => {
  const emptyCarouselsOpacity = useAnimation({
    initialValue: 0,
    value: 1,
    delay: 250,
    duration: 250,
  });
  const emptyCarouselsIconOpacity = useAnimation({
    initialValue: 0,
    value: 1,
    duration: 300,
    delay: 500,
  });
  return (
    <Animated.View style={{opacity: emptyCarouselsOpacity}}>
      <GenericEmptyState
        style={styles.fullHeightCenteredContainer}
        headerText={I18n.t('solutions.results.carousels_empty.header')}
        bodyText={I18n.t('solutions.results.carousels_empty.text')}
        IconComponent={
          <EmptyIconWithAnimation opacity={emptyCarouselsIconOpacity} />
        }
      />
    </Animated.View>
  );
});

const AniamtedScrollView = Animated.createAnimatedComponent(ScrollView);
const SuggestedCarousels = React.memo(
  ({solution, carouselsApiQueryDefinitions}) => {
    const opacity = useAnimation({
      initialValue: 0,
      value: 1,
      delay: 250,
      duration: 250,
    });
    return (
      <AniamtedScrollView
        style={[styles.suggestedEntitiesCarousels, {opacity}]}>
        {carouselsDefinitions.map((type) => {
          const {reducerStatePath, query} = carouselsApiQueryDefinitions[type];
          return (
            <ItemErrorBoundary
              key={type}
              boundaryName="SolutionSuggestedCarousel">
              <ResultsSuggestion
                type={type}
                solution={solution}
                reducerStatePath={reducerStatePath}
                query={query}
              />
            </ItemErrorBoundary>
          );
        })}
        <View style={styles.paddingBottomSpacer} />
      </AniamtedScrollView>
    );
  },
);
SuggestedCarousels.propTypes = {
  solution: solutionScheme,
  carouselsApiQueryDefinitions: PropTypes.shape({
    reducerStatePath: PropTypes.string,
    query: PropTypes.object,
  }),
};

const carouselsStateTypes = {
  INITIAL: 'initial',
  LOADING: 'loading',
  LOADED: 'loaded',
  LOADED_WITH_DATA: 'loadedWithDate',
  LOADED_AND_EMPTY: 'loadedAndEmpty',
};

const getComponentByCarouselsState = ({
  solution,
  carouselsApiQueryDefinitions,
}) => ({
  [carouselsStateTypes.INITIAL]: null,
  [carouselsStateTypes.LOADED]: null,
  [carouselsStateTypes.LOADING]: (
    <Spinner
      style={styles.fullHeightCenteredContainer}
      size="large"
      color={flipFlopColors.green}
    />
  ),
  [carouselsStateTypes.LOADED_AND_EMPTY]: <EmptyCarousels />,
  [carouselsStateTypes.LOADED_WITH_DATA]: (
    <SuggestedCarousels
      solution={solution}
      carouselsApiQueryDefinitions={carouselsApiQueryDefinitions}
    />
  ),
});

const carouselsDefinitions = Object.values(suggestedSolutionsTypes);
function ResultsSuggestions({solution}) {
  const dispatch = useDispatch();
  const {id: solutionId, tagName: tag} = solution;
  const allCarouselsState = useSelector((state) =>
    get(state, `solutions.carousels.${solutionId}`, {}),
  );
  const [carouselsState, setCarouselsLoadingState] = useState(
    carouselsStateTypes.INITIAL,
  );
  const carouselsPromises = useRef([]).current;
  const carouselsApiQueryDefinitions = useRef({}).current;

  const fetchAllCarousels = useCallback(() => {
    carouselsDefinitions.forEach((type) => {
      const {query} = getParamsByType({
        type,
        numOfItemsToShow: 10,
        tags: [tag],
      });
      const reducerStatePath = `solutions.carousels.${solutionId}.${type}`;
      carouselsApiQueryDefinitions[type] = {query, reducerStatePath};
      const queryAction = getSolutionsCarousel({query, reducerStatePath});
      carouselsPromises.push(dispatch(queryAction));
    });
    setCarouselsLoadingState(carouselsStateTypes.LOADING);
    Promise.all(carouselsPromises).finally(() => {
      setCarouselsLoadingState(carouselsStateTypes.LOADED);
    });
  }, [solution]);

  const removeAllCarousels = useCallback(() => {
    const promises = [];
    setCarouselsLoadingState(carouselsStateTypes.INITIAL);
    carouselsDefinitions.forEach((type) => {
      const queryAction = removeSolutionsCarrousel({type, id: solutionId});
      promises.push(dispatch(queryAction));
    });
  }, [solution]);

  useEffect(() => {
    fetchAllCarousels();
    return () => {
      removeAllCarousels();
    };
  }, [solution]);

  useEffect(() => {
    if (carouselsState === carouselsStateTypes.LOADED) {
      const isAllCarouselsEmpty = Object.values(
        allCarouselsState,
      ).every(({data}) => isEmpty(data));
      setCarouselsLoadingState(
        isAllCarouselsEmpty
          ? carouselsStateTypes.LOADED_AND_EMPTY
          : carouselsStateTypes.LOADED_WITH_DATA,
      );
    }
  }, [carouselsState]);

  return getComponentByCarouselsState({solution, carouselsApiQueryDefinitions})[
    carouselsState
  ];
}

export default ResultsSuggestions;
