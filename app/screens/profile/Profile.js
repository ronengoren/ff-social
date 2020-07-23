import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import I18n from '/infra/localization';
import {connect} from 'react-redux';
import {flipFlopColors, uiConstants} from '../../vars';
import {
  View,
  Text,
  CallToActionArea,
  ScrollView,
  FloatingHeader,
} from '../../components/basicComponents';
import {Screen, Feed} from '../../components';
import {get, isNumber, isAppAdmin} from '../../infra/utils';
import ProfileHeader from './ProfileHeader';
import ProfileHeaderButtons from './ProfileHeaderButtons';
import ProfileActionsContainer from './ProfileActionsContainer';
import ProfileJourney from './ProfileJourney';
import {InteractionsBar} from '../../components/interactions';
import ActivationsCarousel from './ActivationsCarousel';
import SavedItems from './SavedItems';
import EntitiesCarousel from './EntitiesCarousel';

const HEADER_BREAKPOINT_WITH_IMAGE = 360;
const HEADER_BREAKPOINT_WITHOUT_IMAGE = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  journeyContent: {
    backgroundColor: flipFlopColors.white,
    marginVertical: 15,
  },
  detailsContent: {
    marginBottom: 10,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  contentMargin5: {
    marginVertical: 5,
  },
  horizontalMarginContent: {
    marginHorizontal: 15,
  },
  feed: {
    flex: 1,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  myOwnBioTextWrapper: {
    paddingTop: 5,
    marginBottom: 15,
  },
  myOwnBioText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myOwnBioCta: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  bioPlaceholder: {
    height: 100,
    marginTop: 11,
    marginBottom: 15,
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.azure,
  },
  bioPlaceholderText: {
    height: 19,
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.azure,
  },
  darkBackground: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
    paddingTop: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  createBusinessRow: {
    marginBottom: 3,
  },
  detailsRowText: {
    fontSize: 16,
    paddingRight: 15,
  },
  detailsRowIcon: {
    marginRight: 10,
  },
  personalDetailsPlaceholderText: {
    fontSize: 16,
    lineHeight: 22,
    color: flipFlopColors.azure,
  },
  ownedPagesRow: {
    marginRight: 12,
  },
  ownedPagesText: {
    color: flipFlopColors.azure,
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentActivityHeaderText: {
    fontSize: 16,
    lineHeight: 21,
    color: flipFlopColors.black,
  },
  feedErrorText: {
    color: flipFlopColors.placeholderGrey,
    textAlign: 'center',
  },
  firstItemCarouselStyle: {
    marginLeft: 15,
  },
  interactionBar: {
    marginTop: 5,
    marginBottom: 15,
  },
  interactionIconsContainer: {
    marginBottom: 8,
  },
  profileSubHeader: {
    backgroundColor: flipFlopColors.white,
  },
  actionsheetIcon: {
    paddingLeft: 4,
  },
});

class Profile extends React.Component {
  state = {
    invited: false,
    withoutFeed: false,
    showFloatingHeader: false,
    withoutFeed: true,
  };
  render() {
    const {userProfileId} = this.props;
    const {showFloatingHeader} = this.state;
    if (this.state.withoutFeed) {
      return (
        <ScrollView onScroll={this.handleScroll}>
          {this.renderUserDetails()}
          {this.renderFeedError()}
          <FloatingHeader
            showFloatingHeader={showFloatingHeader}
            height={uiConstants.NAVBAR_HEIGHT}>
            {this.renderHeaderButtons({isRenderedInHeader: false})}
          </FloatingHeader>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.feed}>
          <Feed
            ListHeaderComponent={this.renderUserDetails()}
            onRef={(node) => {
              this.feed = node;
            }}
            showErrorPageOnFail={false}
            normalizedSchema="FEED"
            onScroll={this.handleScroll}
          />
          <FloatingHeader
            showFloatingHeader={showFloatingHeader}
            height={uiConstants.NAVBAR_HEIGHT}>
            {this.renderHeaderButtons({isRenderedInHeader: false})}
          </FloatingHeader>
        </View>
      );
    }
  }

  componentDidMount = async () => {
    LayoutAnimation.easeInEaseOut();
  };

  renderUserDetails() {
    const {
      profile,
      thumbnail,
      userProfileId,
      ownUser,
      hasFeedContent,
    } = this.props;
    const {numOfFriends, aroundCurrent, aroundOrigin, aroundCommunity} = get(
      profile,
      'data',
      {},
    );
    // let {user} = get(profile, 'data', {});
    // if (!user.id) {
    //   user = {id: userProfileId, media: {thumbnail}, ...user};
    // }
    // const userImage = get(profile, 'data.user.media.profile');
    // const instagramToken = get(profile, 'data.user.instagramV2Token');
    // const groupsCount =
    //   get(profile, 'data.totals.joinedGroups', 0) +
    //   get(profile, 'data.totals.ownedGroups', 0);
    // const savedTotals = get(profile, 'data.themes.savedTotals');
    // const shouldRenderSavedItems = this.isViewingOwnProfile && !!savedTotals;
    // const userCommunity = get(profile, 'data.user.community');

    return (
      <View style={styles.container}>
        <ProfileHeader
          TopComponent={this.renderHeaderButtons({isRenderedInHeader: true})}
          ButtonsComponent={this.renderProfileActions()}
        />
        <View style={styles.profileSubHeader}>
          <ProfileJourney
            // userCommunity={userCommunity}
            // ownUser={ownUser}
            style={[styles.horizontalMarginContent, styles.journeyContent]}
            // journey={get(user, 'journey')}
            // aroundCommunity={aroundCommunity}
            // aroundCurrent={aroundCurrent}
            // aroundOrigin={aroundOrigin}
            // isViewingOwnProfile={this.isViewingOwnProfile}
            // navigateToEditProfile={this.navigateToEditProfile}
          />
          {!this.isViewingOwnProfile && (
            <InteractionsBar
              style={styles.interactionBar}
              interactionIconsContainerStyle={styles.interactionIconsContainer}
              // user={user}
              iconSize={21}
              // originType={originTypes.USER_PROFILE}
              isFlatIcons
              withSeparators
            />
          )}
        </View>
        <View style={styles.darkBackground}>
          {this.renderProfileDetails()}
          <ActivationsCarousel
            style={styles.marginVertical10}
            firstItemStyle={styles.firstItemCarouselStyle}
            // user={user}
            isViewingOwnActivations={this.isViewingOwnProfile}
            // name={user.name}
          />
          <View style={[styles.contentMargin5]}>
            <SavedItems
              firstItemStyle={styles.firstItemCarouselStyle}
              // totals={savedTotals}
              // appUser={ownUser}
              // profileUser={user}
            />
          </View>
          <View style={[styles.contentMargin5]}>
            <EntitiesCarousel
              firstItemStyle={styles.firstItemCarouselStyle}
              title={I18n.t('profile.view.friends')}
              // query={{ domain: 'friendships', key: 'friends', params: { userId: user.id, excludeMutual: true } }}
              // count={numOfFriends}
              // onAllPress={this.navigateToFriendsList}
              // onItemPress={this.navigateToProfle}
              // isUserEntity
            />
          </View>
          <View style={[styles.contentMargin5]}>
            <EntitiesCarousel
              // showItemBadge={(item) => item && item.manager && item.manager.some((m) => m.id === userProfileId)}
              firstItemStyle={styles.firstItemCarouselStyle}
              title={I18n.t('profile.view.groups')}
              // query={{ domain: 'groups', key: 'getMembered', params: { userId: userProfileId, groupType: groupType.GROUP } }}
              // userProfileId={userProfileId}
              // count={groupsCount}
              // onAllPress={this.navigateToGroupsList}
              // onItemPress={this.navigateToGroup}
            />
          </View>
        </View>
      </View>
    );
  }
  renderProfileActions() {
    const {profile} = this.props;
    // const {friendshipStatus} = profile.data;

    if (!isNumber() && !this.isViewingOwnProfile) {
      return <View />;
    }
    return (
      <ProfileActionsContainer
        user={profile.data}
        isViewingOwnProfile={this.isViewingOwnProfile}
        handleSettingsPress={this.handleSettingsPress}
        respondToRequest={this.respondToFriendRequest}
        requestFriendship={this.toggleFriendshipRequest}
        cancelFriendshipRequest={this.openCancelFriendRequestActionSheet}
        unFriend={this.openMainActionSheet}
      />
    );
  }
  renderHeaderButtons({isRenderedInHeader} = {}) {
    const {profile} = this.props;

    return (
      <ProfileHeaderButtons
        handleSettingsPress={this.handleSettingsPress}
        handleSettingsLongPress={this.handleSettingsLongPress}
        // text={isRenderedInHeader ? null : profile.data.user.name}
        isViewingOwnProfile={this.isViewingOwnProfile}
        isRenderedInHeader={isRenderedInHeader}
        navigateBack={() => navigationService.goBack()}
        // openProfileActionsheet={() =>
        //   this.openMainActionSheet({withReport: true})
        // }
        // hasProfileData={!!profile.data}
      />
    );
  }

  renderDetails() {
    // const { profile } = this.props;
    // const { birthday, relationship, numOfKids, workDetails = {}, pages } = get(profile, 'data', {});
    // const birthdayText = birthday && getAge(birthday);
    // const relationshipText =
    //   relationship >= 0 && relationship !== relationshipType.UNKNOWN && pluralTranslateWithZero(numOfKids || 0, `profile.profile_relationship.${relationship}`);
    // const workText = workDetails.title && workDetails.place ? I18n.t('profile.view.workplace', workDetails) : workDetails.title || workDetails.place;
    // const numOfOwnedPages = get(pages, 'totalCount', 0);
    // const hasRelationship = relationship >= 0 && relationship !== relationshipType.UNKNOWN;

    // const showDetails = !!(this.isViewingOwnProfile || birthday || hasRelationship || workDetails.title || workDetails.place) || numOfOwnedPages > 0;

    // if (!showDetails) {
    //   return null;
    // }

    return (
      <View style={styles.detailsContent}>
        <View style={styles.horizontalMarginContent}>
          {(this.isViewingOwnProfile || !!birthdayText) &&
            this.renderDetailsRow({
              iconName: 'birthday-cake',
              iconSize: 15,
              text: birthdayText,
              placeholderText: I18n.t('profile.view.date_of_birth_placeholder'),
              focusField: 'date_of_birth',
            })}
          {(this.isViewingOwnProfile || !!relationshipText) &&
            this.renderDetailsRow({
              iconName: 'heart',
              iconSize: 14,
              text: relationshipText,
              placeholderText: I18n.t('profile.view.relationship_placeholder'),
              focusField: 'relationship',
            })}
          {(this.isViewingOwnProfile || !!workText) &&
            this.renderDetailsRow({
              iconName: 'suitcase',
              iconSize: 14,
              text: workText,
              placeholderText: I18n.t('profile.view.workplace_placeholder'),
              noMarginBottom: true,
              focusField: 'workplace',
            })}
          {!!numOfOwnedPages && this.renderOwnedPagesRow()}
          {this.isViewingOwnProfile && this.renderCreateBusinessRow()}
        </View>
      </View>
    );
  }
  renderDetailsRow({iconName, iconSize, text, placeholderText, focusField}) {
    return (
      <View style={[styles.detailsRow]}>
        <AwesomeIcon
          name={iconName}
          size={iconSize}
          color={flipFlopColors.b70}
          style={styles.detailsRowIcon}
        />
        {text ? (
          <Text
            color={flipFlopColors.b30}
            style={styles.detailsRowText}
            lineHeight={22}>
            {text}
          </Text>
        ) : (
          <Text
            color={flipFlopColors.b30}
            style={styles.personalDetailsPlaceholderText}
            onPress={() => this.navigateToEditProfile({focusField})}>
            {placeholderText}
          </Text>
        )}
      </View>
    );
  }
  renderOwnedPagesRow() {
    const {profile} = this.props;
    const {pages} = get(profile, 'data', {});
    const numOfOwnedPages = get(pages, 'totalCount', 0);
    const ownerOf = I18n.t('profile.view.owner_of');
    const isAndroidAndRTL = Platform.OS === 'android' && isRTL(ownerOf);

    return numOfOwnedPages ? (
      <View style={[styles.detailsRow, styles.ownedPagesRow]}>
        <AwesomeIcon
          name="globe"
          size={14}
          color={flipFlopColors.b70}
          style={styles.detailsRowIcon}
        />
        <Text
          numberOfLines={1}
          style={styles.detailsRowText}
          onPress={() => isAndroidAndRTL && this.navigateToPagesList()}
          alignLocale>
          <Text style={styles.detailsRowText}>{ownerOf}&nbsp;</Text>
          {numOfOwnedPages > 1 && (
            <Text
              onPress={this.navigateToPagesList}
              style={styles.ownedPagesText}>
              {I18n.t('profile.view.owner_of_pages', {count: numOfOwnedPages})}
              &nbsp;
            </Text>
          )}
          {pages.data.map((page, idx) => (
            <Text
              style={styles.ownedPagesText}
              onPress={() => this.navigateToPage(page.id)}
              key={page.id}>
              {idx !== 0 ? ', ' : ''}
              {page.name}
            </Text>
          ))}
        </Text>
      </View>
    ) : null;
  }
  renderCreateBusinessRow() {
    return (
      <TouchableOpacity
        style={[styles.detailsRow, styles.createBusinessRow]}
        onPress={this.navigateToPageCreation}>
        <AwesomeIcon
          name="globe"
          size={14}
          color={flipFlopColors.b70}
          style={styles.detailsRowIcon}
        />
        <Text style={styles.personalDetailsPlaceholderText} lineHeight={22}>
          {I18n.t('profile.view.create_a_business')}
        </Text>
      </TouchableOpacity>
    );
  }
  renderBio() {
    // const { profile } = this.props;
    // const { bio } = get(profile, 'data', {});

    // const showBio = !!(this.isViewingOwnProfile || bio);

    // if (!showBio) {
    //   return null;
    // }

    return (
      <View style={[styles.horizontalMarginContent, styles.marginVertical10]}>
        {/* {this.renderBioTitle()}
        {this.renderBioText()} */}
      </View>
    );
  }
  renderBioTitle() {
    // const { profile } = this.props;
    // const firstName = get(profile, 'data.name.firstName', '');

    return (
      <Text bold size={16} lineHeight={21} color={flipFlopColors.b30}>
        {this.isViewingOwnProfile
          ? I18n.t('profile.view.details_title.mine')
          : I18n.t('profile.view.details_title.others', {firstName})}
      </Text>
    );
  }
  renderBioText() {
    // const { profile } = this.props;
    // const bio = get(profile, 'data.bio');

    // if (bio) {
    //   return <HtmlTextWithLinks text={bio} style={styles.myOwnBioTextWrapper} ctaTextStyle={styles.myOwnBioCta} textStyle={styles.myOwnBioText} lineHeight={22} disableRtl />;
    // } else if (this.isViewingOwnProfile) {
    return (
      <CallToActionArea
        style={styles.bioPlaceholder}
        textStyle={styles.bioPlaceholderText}
        text={I18n.t('profile.view.bio_placeholder')}
        // onPress={() => this.navigateToEditProfile({ focusField: 'bio' })}
      />
    );
    // } else {
    //   return null;
    // }
  }
  renderFeedError = () => (
    <View>
      <Text size={15} lineHeight={22} style={styles.feedErrorText}>
        {I18n.t('error_boundaries.default.title')}
      </Text>
    </View>
  );
  renderFeedTitle() {
    return (
      <View
        onLayout={({
          nativeEvent: {
            layout: {y},
          },
        }) => this.setState({subHeaderLayoutY: y})}
        style={styles.horizontalMarginContent}>
        <Text
          bold
          style={styles.recentActivityHeaderText}
          color={flipFlopColors.b30}>
          {this.isViewingOwnProfile
            ? I18n.t('profile.view.activity_header.mine')
            : I18n.t('profile.view.activity_header.others')}
        </Text>
      </View>
    );
  }

  renderProfileDetails = () => (
    <View>{/* {this.renderDetails()}
      {this.renderBio()} */}</View>
  );
}

export default Profile;
