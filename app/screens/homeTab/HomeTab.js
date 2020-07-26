import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {GenericListEmptyState} from '../../components/emptyState';
import {IntroductionPostEditor} from '../../components/introduction';
import {getFirstName} from '../../infra/utils/stringUtils';
import {getGreetingTime} from '../../infra/utils/dateTimeUtils';
import StoriesCarousel from './stories/StoriesCarousel';
import UserGroupsCarousel from './UserGroupsCarousel';

import {View, Text, Avatar, PostButton} from '../../components/basicComponents';
import {
  Screen,
  Feed,
  Header,
  SubHeader,
  ItemErrorBoundary,
} from '../../components';

import CardButton from './CardButton';
import {flipFlopColors, commonStyles} from '../../vars';
import SavedItemsIndicator from './SavedItemsIndicator';
import HeaderIndicator from './HeaderIndicator';
import ChatHeaderIndicator from './ChatHeaderIndicator';
import {
  editModes,
  screenNames,
  originTypes,
  entityTypes,
  filterTypes,
} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  header: {
    backgroundColor: flipFlopColors.white,
    paddingHorizontal: 15,
  },
  feedHeaderWrapper: {
    flex: 1,
  },
  headerUpperSection: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    marginBottom: 20,
    ...commonStyles.newSmallShadow,
  },
  indicatorsRow: {
    flexDirection: 'row',
    marginStart: 10,
    marginEnd: 5,
  },
  indicatorsRowRtl: {
    flexDirection: 'row-reverse',
  },
  headerIndicatorsDivider: {
    width: 25,
  },
  userName: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 4,
    marginTop: 15,
    textAlign: 'left',
  },
  userNameRTL: {
    textAlign: 'right',
  },
  greetingTime: {
    flex: 1,
    paddingHorizontal: 15,
  },
  greetingTimeRTL: {
    textAlign: 'right',
  },
  postButtonWrapper: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    ...commonStyles.greenBtnShadow,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.b95,
  },
});
class HomeTab extends React.Component {
  static feeds = {
    NEWS_FEED: 'myFeed',
    NEWS_FEED_V2: 'myFeed_v2',
    NEWS_FEED_V3: 'myFeed_v3',
    NATIONALITY_FEED: 'nationality',
    COMMUNITY_FEED: 'community',
    SCHEDULED_POSTS: 'scheduled',
  };

  static getAdminFeeds = ({selectedCommunity, user}) =>
    compact([
      {
        name: I18n.t(`home.feeds_for_admins.${HomeTab.feeds.NEWS_FEED}`),
        value: HomeTab.feeds.NEWS_FEED,
      },
      {
        name: I18n.t(`home.feeds_for_admins.${HomeTab.feeds.NEWS_FEED_V2}`),
        value: HomeTab.feeds.NEWS_FEED_V2,
      },
      {
        name: I18n.t(`home.feeds_for_admins.${HomeTab.feeds.NEWS_FEED_V3}`),
        value: HomeTab.feeds.NEWS_FEED_V3,
      },
      {
        name:
          get(selectedCommunity, 'cityName') ||
          get(user, 'community.cityName') ||
          I18n.t(`home.feeds_for_admins.${HomeTab.feeds.COMMUNITY_FEED}`),
        value: HomeTab.feeds.COMMUNITY_FEED,
      },
      {
        name: I18n.t(`home.feeds_for_admins.${HomeTab.feeds.NATIONALITY_FEED}`),
        value: HomeTab.feeds.NATIONALITY_FEED,
      },
      {
        name: I18n.t(`home.feeds_for_admins.${HomeTab.feeds.SCHEDULED_POSTS}`),
        value: HomeTab.feeds.SCHEDULED_POSTS,
      },
    ]);

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {params},
      },
      hasSeenWelcomeAnnotations,
      user,
    } = props;
    this.state = {};
    this.scrollY = 0;
  }

  render() {
    const {activeSubTab, isWaitingForAnnotation} = this.state;
    const {showIntroPost, user} = this.props;
    const isNewsFeed = [HomeTab.feeds.NEWS_FEED].includes(activeSubTab);
    const isScheduledPostsSubTab =
      activeSubTab === HomeTab.feeds.SCHEDULED_POSTS;
    const normalizedSchema = 'FEED';

    return (
      <View testID="homeTab" style={commonStyles.flex1}>
        {this.renderHeader()}
        <Feed
          scrollToFeedTop={this.scrollToFeedTop}
          activeHomeTab={HomeTab.feeds.NEWS_FEED}
          normalizedSchema={normalizedSchema}
          ListHeaderComponent={this.renderFeedHeader}
          ListEmptyComponent={
            isScheduledPostsSubTab ? (
              <GenericListEmptyState
                type={entityTypes.SCHEDULED_POST}
                headerText={I18n.t(`home.scheduled_empty_state.header`)}
              />
            ) : null
          }
          originType={originTypes.HOME_FEED}
          ref={(feedRef) => {
            this.feedRef = feedRef;
          }}
          extraTopComponent={
            showIntroPost && isNewsFeed ? (
              <IntroductionPostEditor
                scrollToOffset={this.scrollToOffset}
                key="introPost"
              />
            ) : null
          }
          onTopFetchAction={this.refreshStoriesCarousel}
        />
      </View>
    );
  }
  renderHeader() {
    const {
      user,
      selectedCommunity,
      selectedContextCountryCode,
      isRtlDesign,
    } = this.props;
    const UserProfileIconComponent = (
      <Avatar
        onPress={this.navigateToProfile}
        // onLongPress={this.navigateToConnectedAccounts}
        imageStyle={styles.userAvatar}
        entityId={'1'}
        entityType="user"
        // themeColor={themeColor}
        // thumbnail={userThumbnail}
        name={'name'}
        testID="cityTabBtn"
      />
    );
    const HeaderIndicators = (
      <View
        style={[styles.indicatorsRow, isRtlDesign && styles.indicatorsRowRtl]}>
        <SavedItemsIndicator />

        <View style={styles.headerIndicatorsDivider} />
        <ChatHeaderIndicator />
      </View>
    );

    return (
      <Header
        style={styles.header}
        withHorizontalPadding={false}
        withShadow={true}
        withBorderBottom={false}
        rightComponent={
          isRtlDesign ? UserProfileIconComponent : HeaderIndicators
        }
        leftComponent={
          isRtlDesign ? HeaderIndicators : UserProfileIconComponent
        }
      />
    );
  }
  renderFeedHeader = () => {
    const {showFeedsForAdmins, isRtlDesign} = this.props;
    const greetingTimeDefinition = getGreetingTime();

    const greetingLines = [
      I18n.t('home.user_greeting', {name: getFirstName('name')}),
      I18n.t(`home.${greetingTimeDefinition}`),
    ];

    return (
      <View style={styles.feedHeaderWrapper}>
        <View style={styles.headerUpperSection}>
          <Text
            size={32}
            lineHeight={38}
            color={flipFlopColors.b30}
            bolder
            style={[styles.userName, isRtlDesign && styles.userNameRTL]}>
            {greetingLines[0]}
          </Text>
          <ItemErrorBoundary boundaryName="HomeStories">
            <StoriesCarousel
              ref={(node) => {
                this.refStoriesCarousel = node;
              }}
            />
          </ItemErrorBoundary>
        </View>
        <PostButton
          style={styles.postButtonWrapper}
          isSecondary
          text={I18n.t('home.post_button_text')}
          onPress={this.navigateToPostCreationPage}
          testID="postButton"
        />
        <ItemErrorBoundary boundaryName="HomeGroupsCarousel">
          <UserGroupsCarousel
            onRef={(node) => {
              this.userGroupsCarousel = node;
            }}
            onLayout={this.handleUserGroupsLayout}
            // isAnnotationActive={liveAnnotation === annotationTypes.GROUPS}
          />
        </ItemErrorBoundary>
      </View>
    );
  };
  navigateToProfile = async () => {
    // const { user } = this.props;
    // const { id: userId } = user;
    navigationService.navigateToProfile();
  };

  getFeedParams = () => {
    const {activeSubTab} = this.state;
    const {selectedCommunity, selectedContextCountryCode, user} = this.props;
    // const nationalityGroupId = get(user, 'nationalityGroup.id');
    // const selectedAllContextCountryCode = [0];
    // const communityId = selectedCommunity ? selectedCommunity.id : null;
    // let contextCountryCode;
    // if (isAppAdmin(user)) {
    //   contextCountryCode = selectedContextCountryCode.length ? selectedContextCountryCode : selectedAllContextCountryCode;
    // }
    // switch (activeSubTab) {
    //   case HomeTab.feeds.SCHEDULED_POSTS:
    //     return { apiQuery: { domain: 'scheduledPosts', key: 'getPosts' }, reducerStatePath: 'scheduledPosts' };
    //   case HomeTab.feeds.COMMUNITY_FEED:
    //     return { apiQuery: { domain: 'feed', key: 'community', params: { communityId, contextCountryCode } }, reducerStatePath: 'communityFeed' };
    //   case HomeTab.feeds.NATIONALITY_FEED:
    //     return { apiQuery: { domain: 'feed', key: 'nationality', params: { nationalityGroupId } }, reducerStatePath: 'communityFeed' };
    //   case HomeTab.feeds.NEWS_FEED_V2:
    //     return {
    //       apiQuery: { domain: 'feed', key: 'news', params: { communityId, contextCountryCode, personalized: 'v2' } },
    //       reducerStatePath: 'newsFeed'
    //     };
    //   case HomeTab.feeds.NEWS_FEED_V3:
    //     return {
    //       apiQuery: { domain: 'feed', key: 'news', params: { communityId, contextCountryCode, personalized: 'v3' } },
    //       reducerStatePath: 'newsFeed'
    //     };
    //   case HomeTab.feeds.NEWS_FEED:
    //   default:
    //     return {
    //       apiQuery: { domain: 'feed', key: 'news', params: { communityId, contextCountryCode, personalized: true } },
    //       reducerStatePath: 'newsFeed'
    //     };
    // }
  };
  scrollToFeedTop = () => {
    this.feedRef && this.feedRef.scrollToIndex({index: 0});
  };
}

export default HomeTab;
