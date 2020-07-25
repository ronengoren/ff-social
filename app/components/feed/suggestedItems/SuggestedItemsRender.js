import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../../infra/localization';

import {Slider, EmptySearch, ItemErrorBoundary} from '../../../components';
import {CarouselItem} from '../../../components/entityCarousel';
import {View, Text} from '../../basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';
import {mediaScheme} from '../../../schemas/common';
import {stylesScheme} from '../../../schemas';
import {
  postTypes,
  suggestedItemTypes,
  originTypes,
  componentNamesForAnalytics,
  entityTypes,
} from '../../../vars/enums';
import {addSpaceOnCapitalsAndCapitalize} from '../../../infra/utils/stringUtils';
import {SuggestedItemLoadingState} from '../../feed/suggestedItems';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -6,
  },
  slide: {
    marginBottom: 15,
  },
});

const hitSlop = {left: 15, right: 5, top: 5, bottom: 5};

class SuggestedItemsRender extends Component {
  // eslint-disable-next-line react/sort-comp
  render() {
    const {
      tags,
      entityType,
      postType,
      items,
      isLoaded,
      type,
      originType,
      wrapperStyle,
      isEmptyState,
      carouselId,
      header,
      navigateToAll,
      color,
      carouselItemProps,
      loadingStateProps,
    } = this.props;
    if (isLoaded && (!items || !items.length)) {
      if (isEmptyState) {
        return (
          <EmptySearch
            text={I18n.t('search_result.empty_state', {
              query: addSpaceOnCapitalsAndCapitalize(tags),
            })}
          />
        );
      }
      return null;
    }

    return (
      <View style={wrapperStyle || styles.wrapper} testID="feedItemView">
        <SuggestedItemsRender.Header
          header={header}
          navigateToAll={navigateToAll}
          color={color}
          postType={postType}
        />

        {!!items && (
          <Slider
            numberOfSlides={items.length}
            sliderWidth={210}
            slidePadding={15}
            name="suggestedItems">
            {(slideProps) =>
              items.map((item, index) => {
                const resolvedItem = item.entity || item;
                const resolvedEntityType = item.entityType || entityType;

                return (
                  <ItemErrorBoundary
                    key={item.id || item.entityId || item}
                    boundaryName="CarouselItem">
                    <CarouselItem
                      carouselId={carouselId}
                      carouselType={type}
                      item={resolvedItem}
                      slide={index}
                      itemNumber={index}
                      entityType={resolvedEntityType}
                      style={styles.slide}
                      originType={originType}
                      componentName={componentNamesForAnalytics.CAROUSEL}
                      fireAnalyticsEvents
                      {...carouselItemProps}
                      {...slideProps}
                    />
                  </ItemErrorBoundary>
                );
              })
            }
          </Slider>
        )}
        {!items && (
          <SuggestedItemLoadingState
            size={carouselItemProps.size}
            {...loadingStateProps}
          />
        )}
      </View>
    );
  }

  static Header = ({header, postType, navigateToAll, color}) => (
    <View style={styles.header}>
      {!!header && (
        <Text bold size={22} lineHeight={24} color={flipFlopColors.b30}>
          {header}
        </Text>
      )}
      {postType !== postTypes.STATUS_UPDATE && !!navigateToAll && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.seeAllBtn}
          onPress={navigateToAll}
          hitSlop={hitSlop}>
          <Text size={13} lineHeight={20} color={color} medium>
            {' '}
            {I18n.t('feed.suggested_items.see_all')}{' '}
          </Text>
          <AwesomeIcon
            name="arrow-circle-right"
            size={16}
            color={color}
            weight="solid"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

SuggestedItemsRender.propTypes = {
  carouselId: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  color: PropTypes.string,
  navigateToAll: PropTypes.func,
  type: PropTypes.oneOf(Object.values(suggestedItemTypes)),
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  postType: PropTypes.oneOf(Object.values(postTypes)),
  tags: PropTypes.string,
  activationId: PropTypes.string,
  theme: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        category: PropTypes.shape({
          name: PropTypes.string,
        }),
        media: mediaScheme,
      }),
    ]),
  ),
  isLoaded: PropTypes.bool,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  wrapperStyle: stylesScheme,
  isEmptyState: PropTypes.bool,
  carouselItemProps: PropTypes.object,
  loadingStateProps: PropTypes.object,
};

SuggestedItemsRender.defaultProps = {
  carouselItemProps: {
    size: CarouselItem.sizes.MEDIUM,
  },
};

export default SuggestedItemsRender;
