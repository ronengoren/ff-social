import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions, TouchableOpacity, Platform} from 'react-native';
import {View, Text, Image} from '../../components/basicComponents';
import {AvatarsList} from '../../components';
import {AwesomeIcon} from '../../assets/icons';
import {get, isEmpty} from '../../infra/utils';
import images from '../../assets/images';
import {flipFlopColors, commonStyles} from '../../vars';
import {screenNames, locationTypes} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import I18n from '../../infra/localization';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  backgroundShadow: {
    position: 'absolute',
    margin: 5,
    top: 0,
    left: 0,
    height: 80,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  dashedBorder: {
    position: 'absolute',
    height: 78,
    top: 6,
    width: 6,
  },
  journeyBox: {
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 90,
    backgroundColor: flipFlopColors.white,
  },
  journeyFrom: {
    marginRight: -1,
  },
  journeyTo: {
    marginLeft: -1,
  },
  locationText: {
    marginTop: 3,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  journeyPlane: {
    position: 'absolute',
    top: 34,
    backgroundColor: flipFlopColors.white,
    paddingVertical: 2,
  },
  usersCount: {
    marginLeft: 3,
  },
  aroundUsersDummy: {
    width: 1,
    height: 18,
  },
});

class ProfileJourney extends Component {
  render() {
    const {style, ownUser, journey} = this.props;
    const {width} = Dimensions.get('window');
    const ownUserCountryCode = get(
      ownUser,
      'journey.originCountry.countryCode',
    );
    const otherUserCountryCode = get(journey, 'originCountry.countryCode');
    const isFromOwnUserOriginCountry =
      ownUserCountryCode === otherUserCountryCode;

    return (
      <View style={[style, styles.container]}>
        {Platform.OS === 'ios' && (
          <View
            style={[
              commonStyles.shadow,
              styles.backgroundShadow,
              {width: width - 30 - 10},
            ]}
          />
        )}
        {this.renderFromBox({isFromOwnUserOriginCountry})}
        {this.renderToBox()}
        <Image
          source={images.common.dotted_border_vertical}
          style={[styles.dashedBorder, {left: (width - 30) / 2 - 3}]}
          resizeMode="cover"
        />
        <AwesomeIcon
          name="plane"
          weight="solid"
          color={flipFlopColors.b90}
          size={18}
          style={[styles.journeyPlane, {left: (width - 30 - 20) / 2}]}
        />
      </View>
    );
  }

  renderFromBox({isFromOwnUserOriginCountry}) {
    const {journey, aroundOrigin, isViewingOwnProfile} = this.props;
    const origin = get(journey, 'origin');

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.journeyBox, styles.journeyFrom]}
        // onPress={() =>
        //   this.handleOnPressOrigin({origin, isFromOwnUserOriginCountry})
        // }
      >
        <Text
          size={13}
          lineHeight={15}
          color={flipFlopColors.b60}
          numberOfLines={1}>
          {isViewingOwnProfile && !origin
            ? I18n.t('profile.view.journey.edit.from.title')
            : I18n.t('profile.view.journey.view.from.title')}
        </Text>
        <Text
          bold
          size={16}
          lineHeight={19}
          color={flipFlopColors.azure}
          style={styles.locationText}
          numberOfLines={1}>
          {/* {this.getOriginText({isFromOwnUserOriginCountry})} */}
        </Text>
        {/* {isFromOwnUserOriginCountry &&
          this.checkIfShouldRenderAroundUsers() &&
          this.renderAroundUsers({aroundData: aroundOrigin})} */}
      </TouchableOpacity>
    );
  }

  renderToBox() {
    const {
      journey,
      aroundCurrent,
      aroundCommunity,
      isViewingOwnProfile,
      userCommunity,
      // ownUser: {
      //   community: {id: ownUserCommunityId},
      // },
    } = this.props;

    const currentlyLiveIn = get(journey, 'currentlyLiveIn');
    const userCommunityId = get(userCommunity, 'id');
    // const isUserInSameCommunityId = userCommunityId === ownUserCommunityId;
    // const isOwnUserWithNeighborhood = isViewingOwnProfile && !currentlyLiveIn;
    // const isAnotherUserWithNeighborhood =
    //   isUserInSameCommunityId && currentlyLiveIn;
    // const aroundData =
    //   (isUserInSameCommunityId && aroundCurrent) || aroundCommunity;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.journeyBox, styles.journeyTo]}
        // onPress={() =>
        //   this.handleOnPressDestiantion({
        //     isOwnUserWithNeighborhood,
        //     isAnotherUserWithNeighborhood,
        //   })
        // }
        testID="journeyDestinationBox">
        <Text
          size={13}
          lineHeight={15}
          color={flipFlopColors.b60}
          numberOfLines={1}>
          {isViewingOwnProfile && !currentlyLiveIn
            ? I18n.t('profile.view.journey.edit.to.title')
            : I18n.t('profile.view.journey.view.to.title')}
        </Text>
        <Text
          bold
          size={16}
          lineHeight={19}
          color={flipFlopColors.azure}
          style={styles.locationText}
          numberOfLines={1}>
          {/* {this.getDestinationsText(isUserInSameCommunityId)} */}
        </Text>
        {/* {this.checkIfShouldRenderAroundUsers() &&
          this.renderAroundUsers({aroundData})} */}
      </TouchableOpacity>
    );
  }

  renderAroundUsers({aroundData}) {
    const {data, totalCount} = aroundData || {};

    if (!data || totalCount === 0) {
      return <View style={styles.aroundUsersDummy} />;
    }
    return (
      <View style={commonStyles.flexDirectionRow}>
        <AvatarsList size="extraTiny" list={data} />
        <Text
          size={13}
          lineHeight={17}
          color={flipFlopColors.b60}
          style={styles.usersCount}>
          {totalCount}
        </Text>
      </View>
    );
  }

  handleOnPressOrigin = ({origin, isFromOwnUserOriginCountry}) => {
    const {isViewingOwnProfile, ownUser} = this.props;
    const shouldNavigateToOriginCountryMembers =
      get(
        ownUser,
        'nationalityGroup.featureFlags.useCountryGranularityFeatures',
      ) || isFromOwnUserOriginCountry;

    if (origin && isFromOwnUserOriginCountry) {
      return this.navigateToOriginCityUsers();
    }
    if (isViewingOwnProfile) {
      const {navigateToEditProfile} = this.props;
      return navigateToEditProfile({focusField: 'origin'});
    }
    if (shouldNavigateToOriginCountryMembers) {
      this.navigateToViewOriginCountryMembers();
    }
    return null;
  };

  handleOnPressDestiantion = ({
    isAnotherUserWithNeighborhood,
    isOwnUserWithNeighborhood,
  }) => {
    if (isAnotherUserWithNeighborhood || isOwnUserWithNeighborhood) {
      this.navigateToNeighborhoodUsers();
    } else {
      this.navigateToViewCommunityMembers();
    }
  };

  navigateToViewCommunityMembers = () => {
    const {userCommunity: community} = this.props;
    navigationService.navigate(screenNames.PeopleTab, {
      initialFilters: {community},
    });
  };

  navigateToViewOriginCountryMembers = () => {
    const originCountry = get(this.props, 'journey.originCountry');
    if (originCountry) {
      navigationService.navigate(screenNames.PeopleTab, {
        initialFilters: {contextCountryCode: [originCountry.countryCode]},
      });
    }
  };

  navigateToOriginCityUsers = () => {
    const {journey} = this.props;
    navigationService.navigate(screenNames.EntitiesInLocation, {
      name: journey.origin,
      type: locationTypes.ORIGIN,
      coordinates: journey.originCoordinates,
    });
  };

  navigateToNeighborhoodUsers = () => {
    const {journey} = this.props;
    navigationService.navigate(screenNames.MyNeighborhoodView, {
      neighborhood: journey.neighborhood,
    });
  };

  checkIfShouldRenderAroundUsers = () =>
    !isEmpty(get(this.props, 'aroundOrigin.data')) ||
    !isEmpty(get(this.props, 'aroundCurrent.data')) ||
    !isEmpty(get(this.props, 'aroundCommunity.data'));

  getOriginText = ({isFromOwnUserOriginCountry}) => {
    const {journey, isViewingOwnProfile, userCommunity} = this.props;
    const origin =
      get(journey, 'origin') ||
      I18n.getTranslatedCountryName({
        countryCode: get(journey, 'originCountry.countryCode'),
      });
    const defaultOriginCountry = I18n.getTranslatedCountryName({
      countryName: get(userCommunity, 'originCountryName'),
    });
    const otherUserCountryName = get(journey, 'originCountry.name');

    if (!isFromOwnUserOriginCountry) {
      return otherUserCountryName;
    }
    if (origin) {
      return origin;
    }
    if (!isViewingOwnProfile && defaultOriginCountry) {
      return defaultOriginCountry;
    }
    return I18n.t(
      `profile.view.journey.${
        isViewingOwnProfile ? 'edit' : 'view'
      }.from.placeholder`,
    );
  };

  getDestinationsText = (isUserInSameCommunityId) => {
    const {journey, userCommunity, isViewingOwnProfile} = this.props;
    const destinationCityName =
      (isUserInSameCommunityId && get(journey, 'currentlyLiveIn')) ||
      get(journey, 'destinationCity.name');
    const cityNameFromCommunity = get(userCommunity, 'cityName');

    if (isViewingOwnProfile && !destinationCityName && !cityNameFromCommunity) {
      return I18n.t(
        `profile.view.journey.${
          isViewingOwnProfile ? 'edit' : 'view'
        }.to.placeholder`,
      );
    }

    if (destinationCityName) {
      return destinationCityName;
    }

    return cityNameFromCommunity;
  };
}

ProfileJourney.propTypes = {
  navigateToEditProfile: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  aroundCommunity: PropTypes.shape({
    data: PropTypes.array,
    totalCount: PropTypes.number,
  }),
  aroundCurrent: PropTypes.shape({
    data: PropTypes.array,
    totalCount: PropTypes.number,
  }),
  aroundOrigin: PropTypes.shape({
    data: PropTypes.array,
    totalCount: PropTypes.number,
  }),
  journey: PropTypes.shape({
    origin: PropTypes.string,
    currentlyLiveIn: PropTypes.string,
    originCoordinates: PropTypes.array,
    neighborhood: PropTypes.object,
    originCountry: PropTypes.object,
  }),
  userCommunity: PropTypes.object,
  ownUser: PropTypes.object,
  isViewingOwnProfile: PropTypes.bool,
};

export default ProfileJourney;
