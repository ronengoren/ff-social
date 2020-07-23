import React from 'react';
import I18n from '../../infra/localization';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, View, ScrollView} from '../basicComponents';
import {flipFlopColors, uiConstants} from '../../vars';
import {filterTypes} from '../../vars/enums';
import PriceFilter from './PriceFilter';
import HoodsFilter from './HoodsFilter';
import CommunitiesFilter from './CommunitiesFilter';
import RoomsFilter from './RoomsFilter';
import DatesFilter from './DatesFilter';
import GendersFilter from './GendersFilter';
import FriendshipsFilter from './FriendshipsFilter';
import RelationshipsFilter from './RelationshipsFilter';
import AgeFilter from './AgeFilter';
import ListingTypeFilter from './ListingTypeFilter';
import CountriesFilter from './CountriesFilter';

const CONTAINER_PADDING_BOTTOM = 0;
const CONTAINER_PADDING_TOP = 250;
const HOOD_CONTAINER_PADDING_TOP = 100;

const BTN_HITSLOP = {top: 15, right: 15, bottom: 15, left: 15};

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 250,
  },
  innerContainer: {
    paddingBottom: 60 + uiConstants.FOOTER_MARGIN_BOTTOM,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  innterContainerWithoutHeader: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.b90,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.paleGreyTwo,
  },
  filtersWrapper: {
    paddingHorizontal: 15,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
    backgroundColor: flipFlopColors.white,
  },
  filtersWrapperWithoutHeader: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

class Filter extends React.Component {
  constructor(props) {
    super(props);
    const {
      filter,
      filterType,
      minAge,
      maxAge,
      neighborhoodsIds,
      hoodNames,
      hoodsFromSearch,
      communityId,
      communityCityName,
      contextCountryCode,
    } = props;
    const {height} = Dimensions.get('window');

    let state = {};
    if (filterType === filterTypes.AGE && (minAge || maxAge)) {
      state = {minAge, maxAge};
    } else if (
      [filterTypes.COUNTRY, filterTypes.ORIGIN_COUNTRY].includes(filterType) &&
      contextCountryCode
    ) {
      state = {contextCountryCode};
    } else if (
      filterType === filterTypes.HOODS &&
      (neighborhoodsIds || hoodNames)
    ) {
      state = {
        neighborhoodsIds: neighborhoodsIds || [],
        hoodNames: hoodNames || [],
        hoodsFromSearch: hoodsFromSearch || [],
      };
    } else if (
      filterType === filterTypes.COMMUNITY &&
      (communityId || communityCityName)
    ) {
      state = {community: {id: communityId, cityName: communityCityName}};
    } else {
      state = filter
        ? {[filterType]: filter, hoodsFromSearch}
        : this.getDefaultFilterState();
    }
    this.state = {
      ...state,
      translateY: new Animated.Value(height),
      backgroundColorOpacity: new Animated.Value(0),
      paddingBottom: new Animated.Value(props.containerPaddingBottom),
      paddingTop: new Animated.Value(props.containerPaddingTop),
    };
  }

  render() {
    const {closeFilter, filterType, withHeader, filterColor} = this.props;
    const {
      backgroundColorOpacity,
      translateY,
      paddingBottom,
      paddingTop,
    } = this.state;
    const backgroundColor = backgroundColorOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(125, 152, 179, 0)', 'rgba(125, 152, 179, 0.5)'],
    });

    const headerText = I18n.t(`filters.${filterType}.header`);
    const okButtonText = this.getOKbuttonText({filterType});

    return (
      <Modal
        transparent
        visible
        onRequestClose={() => {}}
        onShow={this.showContentAnimation}>
        <TouchableOpacity
          onPress={() => this.hideContentAnimation(closeFilter)}
          activeOpacity={1}>
          <Animated.View
            style={[
              styles.outerContainer,
              {paddingBottom, paddingTop, backgroundColor},
            ]}>
            <Animated.View style={{transform: [{translateY}]}}>
              <TouchableOpacity
                onPress={() => {}}
                activeOpacity={1}
                style={[
                  styles.innerContainer,
                  !withHeader && styles.innterContainerWithoutHeader,
                ]}>
                {withHeader && (
                  <View style={styles.header}>
                    <Text
                      size={16}
                      lineHeight={21}
                      color={flipFlopColors.b30}
                      bold>
                      {headerText}
                    </Text>
                    <TouchableOpacity
                      onPress={this.handleSubmitPressed}
                      hitSlop={BTN_HITSLOP}>
                      <Text size={16} lineHeight={21} color={filterColor} bold>
                        {okButtonText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <ScrollView
                  style={[
                    styles.filtersWrapper,
                    !withHeader && styles.filtersWrapperWithoutHeader,
                  ]}>
                  {this.renderFilter()}
                </ScrollView>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }

  componentDidMount() {
    const {filterType} = this.props;
    if (
      [
        filterTypes.HOODS,
        filterTypes.COMMUNITY,
        filterTypes.COUNTRY,
        filterTypes.ORIGIN_COUNTRY,
      ].includes(filterType)
    ) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.handleKeyboardShown,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this.handleKeyboardHidden,
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  getOKbuttonText = () => {
    const {actionButtonText} = this.props;
    return actionButtonText || I18n.t(`filters.ok_button.default`);
  };

  renderFilter = () => {
    const {filterType} = this.props;
    switch (filterType) {
      case filterTypes.COUNTRY: {
        return this.renderCountriesFilter();
      }
      case filterTypes.ORIGIN_COUNTRY: {
        return this.renderOriginCountriesFilter();
      }
      case filterTypes.COMMUNITY: {
        return this.renderCommunitiesFilter();
      }
      case filterTypes.HOODS: {
        return this.renderHoodsFilter();
      }
      case filterTypes.DATES: {
        return this.renderDatesFilter();
      }
      case filterTypes.PRICE: {
        return this.renderPriceFilter();
      }
      case filterTypes.ROOMS: {
        return this.renderRoomsFilter();
      }
      case filterTypes.GENDER: {
        return this.renderGenderFilter();
      }
      case filterTypes.FRIENDSHIP_STATUS: {
        return this.renderFriendshipsFilter();
      }
      case filterTypes.RELATIONSHIP_STATUS: {
        return this.renderRelationshipFilter();
      }
      case filterTypes.AGE: {
        return this.renderAgeFilter();
      }
      case filterTypes.LISTING_TYPE: {
        return this.renderListingTypeFilter();
      }
      default: {
        return null;
      }
    }
  };

  renderCommunitiesFilter = () => {
    const {
      community: {id: communityId},
    } = this.state;
    const {
      withHeader,
      communitiesSortAttribute,
      totals,
      additionalFilteresSelectors,
    } = this.props;

    return (
      <CommunitiesFilter
        onPressFilter={this.handleSubmitPressed}
        withHeader={withHeader}
        additionalFilteresSelectors={additionalFilteresSelectors}
        communityId={communityId}
        communitiesSortAttribute={communitiesSortAttribute}
        onCommunityChanged={(community) => this.setState({community})}
        totals={totals}
      />
    );
  };

  renderHoodsFilter = () => {
    const {hoodsParams, communityId} = this.props;
    const {neighborhoodsIds, hoodsFromSearch, hoodNames} = this.state;
    return (
      <HoodsFilter
        onHoodsChanged={({hoodsIds, hoodNames}) =>
          this.setState({neighborhoodsIds: hoodsIds, hoodNames})
        }
        updateHoodsFromSearch={({hoodsFromSearch}) =>
          this.setState({hoodsFromSearch})
        }
        communityId={communityId}
        hoodsIds={neighborhoodsIds}
        hoodsFromSearch={hoodsFromSearch}
        hoodNames={hoodNames}
        reducerStatePath={hoodsParams.reducerStatePath}
        apiQuery={hoodsParams.apiQuery}
      />
    );
  };

  renderDatesFilter = () => {
    const {dates} = this.state;
    return (
      <DatesFilter
        onDatesChanged={(dates) => {
          this.setState({dates});
        }}
        startDate={new Date(dates.startDate)}
        endDate={dates.endDate ? new Date(dates.endDate) : null}
      />
    );
  };

  renderPriceFilter = () => {
    const {
      price: {currentMax, currentMin, minValue, maxValue},
    } = this.state;
    return (
      <PriceFilter
        onPriceChanged={(values) => {
          this.setState({
            price: {
              ...this.state.price,
              currentMin: values[0],
              currentMax: values[1],
            },
          });
        }}
        currentMin={currentMin}
        currentMax={currentMax}
        minValue={minValue}
        maxValue={maxValue}
      />
    );
  };

  renderRoomsFilter = () => {
    const {rooms} = this.state;
    return (
      <RoomsFilter
        onRoomsChanged={(rooms) => {
          this.setState({rooms});
        }}
        rooms={rooms}
      />
    );
  };

  renderCountriesFilter = () => {
    const {withHeader, isSingleChoice} = this.props;
    const {contextCountryCode} = this.state;

    return (
      <CountriesFilter
        withHeader={withHeader}
        onCountriesChange={(newCountriesCodes) => {
          this.setState({contextCountryCode: newCountriesCodes});
        }}
        contextCountryCode={contextCountryCode}
        isSingleChoice={isSingleChoice}
      />
    );
  };

  renderOriginCountriesFilter = () => {
    const {contextCountryCode} = this.state;

    return (
      <CountriesFilter
        onCountriesChange={(newCountriesCodes) => {
          this.setState({contextCountryCode: newCountriesCodes});
        }}
        contextCountryCode={contextCountryCode}
        hasAll={false}
        isSingleChoice
      />
    );
  };

  renderGenderFilter = () => {
    const {genders} = this.state;
    return (
      <GendersFilter
        onGendersChanged={(genders) => {
          this.setState({genders});
        }}
        genders={genders}
      />
    );
  };

  renderFriendshipsFilter = () => {
    const {friendshipStatuses} = this.state;
    return (
      <FriendshipsFilter
        onFriendshipsChanged={(friendshipStatuses) => {
          this.setState({friendshipStatuses});
        }}
        friendshipStatuses={friendshipStatuses}
      />
    );
  };

  renderRelationshipFilter = () => {
    const {relationshipStatuses} = this.state;
    return (
      <RelationshipsFilter
        onRelationshipsChanged={(relationshipStatuses) => {
          this.setState({relationshipStatuses});
        }}
        relationshipStatuses={relationshipStatuses}
      />
    );
  };

  renderAgeFilter = () => {
    const {minAge, maxAge} = this.state;
    return (
      <AgeFilter
        onAgeChanged={(values) => {
          this.setState({
            minAge: AgeFilter.values.min === values[0] ? null : values[0],
            maxAge: AgeFilter.values.max === values[1] ? null : values[1],
          });
        }}
        minAge={minAge}
        maxAge={maxAge}
      />
    );
  };

  renderListingTypeFilter = () => {
    const {entityType, postType, postSubType} = this.props;
    const {tags} = this.state;
    return (
      <ListingTypeFilter
        onListingTypeChanged={({tags, translatedTag}) =>
          this.setState({[filterTypes.LISTING_TYPE]: tags, translatedTag})
        }
        tags={tags}
        entityType={entityType}
        postType={postType}
        postSubType={postSubType}
      />
    );
  };

  handleSubmitPressed = () => {
    const {filterType, applyFilter, clearFilter} = this.props;
    let shouldClearFilter = false;
    if (
      [
        filterTypes.COMMUNITY,
        filterTypes.COUNTRY,
        filterTypes.ORIGIN_COUNTRY,
      ].includes(filterType)
    ) {
      shouldClearFilter = false;
    } else if (
      Array.isArray(this.state[filterType]) &&
      !this.state[filterType].length
    ) {
      shouldClearFilter = true;
    } else if (filterType === filterTypes.AGE) {
      shouldClearFilter = !this.state.minAge && !this.state.maxAge;
    } else if (!Array.isArray(this.state[filterType])) {
      shouldClearFilter =
        !this.state[filterType] && this.state[filterType] !== 0;
    }

    const afterAnimationAction = shouldClearFilter
      ? clearFilter
      : () =>
          applyFilter(this.formatFilterValues({state: this.state, filterType}));
    this.hideContentAnimation(afterAnimationAction);
  };

  handleKeyboardShown = (e) => {
    const {height} = e.endCoordinates;
    const animations = [
      Animated.timing(this.state.paddingTop, {
        toValue: HOOD_CONTAINER_PADDING_TOP,
        duration: 200,
      }),
    ];
    if (isIOS) {
      animations.unshift(
        Animated.timing(this.state.paddingBottom, {
          toValue: height,
          duration: 200,
        }),
      );
    }
    Animated.parallel(animations).start();
  };

  handleKeyboardHidden = () => {
    const animations = [
      Animated.timing(this.state.paddingTop, {
        toValue: CONTAINER_PADDING_TOP,
        duration: 200,
      }),
    ];
    if (isIOS) {
      animations.unshift(
        Animated.timing(this.state.paddingBottom, {
          toValue: CONTAINER_PADDING_BOTTOM,
          duration: 200,
        }),
      );
    }
    Animated.parallel(animations).start();
  };

  formatFilterValues = ({state, filterType}) => {
    if (filterType === filterTypes.DATES) {
      return {
        [filterType]: {
          startDate: state[filterType].startDate.toISOString(),
          endDate: state[filterType].endDate
            ? state[filterType].endDate.toISOString()
            : null,
        },
      };
    } else if (filterType === filterTypes.COMMUNITY) {
      return {
        community: state.community,
        neighborhoodsIds: [],
        hoodsFromSearch: [],
        hoodNames: [],
      };
    } else if (
      [filterTypes.COUNTRY, filterTypes.ORIGIN_COUNTRY].includes(filterType)
    ) {
      return {contextCountryCode: state.contextCountryCode};
    } else if (filterType === filterTypes.HOODS) {
      return {
        neighborhoodsIds: state.neighborhoodsIds,
        hoodsFromSearch: state.hoodsFromSearch,
        hoodNames: state.hoodNames,
      };
    } else if (filterType === filterTypes.AGE) {
      return {minAge: state.minAge, maxAge: state.maxAge};
    } else if (filterType === filterTypes.LISTING_TYPE) {
      return {
        [filterType]: state[filterType],
        translatedTag: state.translatedTag,
      };
    }
    return {[filterType]: state[filterType]};
  };

  getDefaultFilterState = () => {
    const {maxPrice, filterType} = this.props;
    switch (filterType) {
      case filterTypes.ROOMS: {
        return {rooms: 0};
      }
      case filterTypes.PRICE: {
        return {
          price: {
            currentMin: 0,
            currentMax: maxPrice,
            minValue: 0,
            maxValue: maxPrice,
          },
        };
      }
      case filterTypes.DATES: {
        return {dates: {startDate: new Date(), endDate: null}};
      }
      case filterTypes.HOODS: {
        return {neighborhoodsIds: [], hoodsFromSearch: [], hoodNames: []};
      }
      case filterTypes.COMMUNITY: {
        return {community: {}};
      }
      case filterTypes.COUNTRY:
      case filterTypes.ORIGIN_COUNTRY: {
        return {contextCountryCode: []};
      }
      case filterTypes.GENDER: {
        return {genders: []};
      }
      case filterTypes.FRIENDSHIP_STATUS: {
        return {friendshipStatuses: []};
      }
      case filterTypes.RELATIONSHIP_STATUS: {
        return {relationshipStatuses: []};
      }
      case filterTypes.AGE: {
        return {minAge: null, maxAge: null};
      }
      default: {
        return {};
      }
    }
  };

  showContentAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.translateY, {toValue: 0, duration: 350}),
      Animated.timing(this.state.backgroundColorOpacity, {
        toValue: 1,
        duration: 350,
      }),
    ]).start();
  };

  hideContentAnimation = (afterAnimationAction) => {
    const {height} = Dimensions.get('window');
    Animated.parallel([
      Animated.timing(this.state.translateY, {toValue: height, duration: 400}),
      Animated.timing(this.state.backgroundColorOpacity, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(afterAnimationAction);
  };
}

Filter.propTypes = {
  filterColor: PropTypes.string,
  withHeader: PropTypes.bool,
  closeFilter: PropTypes.func,
  totals: PropTypes.array,
  filter: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  minAge: PropTypes.number,
  maxAge: PropTypes.number,
  applyFilter: PropTypes.func,
  clearFilter: PropTypes.func,
  filterType: PropTypes.oneOf(Object.values(filterTypes)),
  actionButtonText: PropTypes.string,
  maxPrice: PropTypes.number,
  hoodsFromSearch: PropTypes.array,
  neighborhoodsIds: PropTypes.array,
  communityId: PropTypes.string,
  hoodNames: PropTypes.array,
  communityCityName: PropTypes.string,
  communitiesSortAttribute: PropTypes.string,
  hoodsParams: PropTypes.shape({
    reducerStatePath: PropTypes.string,
    apiQuery: PropTypes.object,
  }),
  entityType: PropTypes.string,
  postType: PropTypes.string,
  postSubType: PropTypes.string,
  additionalFilteresSelectors: PropTypes.array,
  containerPaddingTop: PropTypes.number,
  containerPaddingBottom: PropTypes.number,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  isSingleChoice: PropTypes.bool,
};

Filter.defaultProps = {
  filterColor: flipFlopColors.green,
  withHeader: true,
  containerPaddingTop: CONTAINER_PADDING_TOP,
  containerPaddingBottom: CONTAINER_PADDING_BOTTOM,
};

export default Filter;
