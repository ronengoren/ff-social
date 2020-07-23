import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {get, getTopUserRole} from '../../infra/utils';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { inviteFriendRequest, isInviteFriendRequestGotError } from '/redux/friendships/actions';
import {
  View,
  IconButton,
  Avatar,
  Text,
  TranslatedText,
  DashedBorder,
  InsiderBadge,
} from '../basicComponents';
import {OthersFriendsList} from '../../screens';
import {flipFlopColors, commonStyles} from '../../vars';
import {
  screenNames,
  entityTypes,
  originTypes,
  friendshipStatusType,
  interactionTypes,
  componentNamesForAnalytics,
} from '../../vars/enums';
import {getYearsAgo} from '../../infra/utils/dateTimeUtils';
// import { analytics } from '/infra/reporting';
import {navigationService} from '../../infra/navigation';
import {userScheme} from '../../schemas';
import InteractionsBar from '../../components/interactions/InteractionsBar';
import {AwesomeIcon} from '../../assets/icons';

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 15,
    marginBottom: 13,
    backgroundColor: flipFlopColors.white,
    borderRadius: 10,
  },
  onboardingWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: flipFlopColors.b70,
  },
  wrapperWithTopMargin: {
    marginTop: 10,
  },
  detailsWrapper: {
    flexDirection: 'row',
    margin: 15,
  },
  details: {
    marginTop: 5,
    marginLeft: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  detailsIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 12,
    marginRight: 8,
  },
  entityAvatarWrapper: {
    width: 100,
    height: 120,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
  },
  entityAvatar: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  entityItemHeaderTexts: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainerWithBadge: {
    alignItems: 'flex-start',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: flipFlopColors.paleGreyFour,
    borderRadius: 45,
  },
  obActionButton: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
    borderWidth: 1,
    width: 40,
    height: 40,
  },
  oBInvitedActionButton: {
    backgroundColor: flipFlopColors.green,
  },
  headerDetails: {
    flex: 1,
    textAlign: 'left',
    marginRight: 8,
  },
  username: {
    marginLeft: 15,
    marginBottom: 3,
  },
  badge: {
    height: 25,
    paddingLeft: 16,
    paddingRight: 10,
    marginTop: 8,
    marginBottom: 5,
  },
  dashedBorder: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  interactionBar: {
    marginBottom: 15,
  },
  interactionIconsContainer: {
    marginBottom: 8,
  },
});

class UserEntityComponent extends Component {
  state = {
    invited: false,
  };

  render() {
    const {
      isOnboarding,
      data,
      data: {
        id,
        journey,
        numOfMutualFriends,
        communityCityName,
        communityId: userCommunityId,
      },
      showAction,
      ownUser,
      disableNavigation,
      disableLocationNavigation,
      index,
      originType,
    } = this.props;

    const {arrivedDate, currentlyLiveIn: journeyCurrentlyLiveIn} = journey;
    const {
      community: {id: ownUserCommunityId, cityName: ownUserCityName},
    } = ownUser;

    const isUserInSameCommunityId = userCommunityId === ownUserCommunityId;
    const currentlyLiveIn = isUserInSameCommunityId
      ? journeyCurrentlyLiveIn || ownUserCityName
      : communityCityName || journeyCurrentlyLiveIn;
    const arrivalDate = arrivedDate ? getYearsAgo(arrivedDate) : null;
    const locationAction =
      disableNavigation || disableLocationNavigation
        ? null
        : this.navigateToNeighborhood;
    const shouldRenderActions =
      (showAction && !ownUser.id !== id) || isOnboarding;
    const shouldRenderInteractionsBar = showAction && shouldRenderActions;

    return (
      <TouchableOpacity
        onPress={this.onPressUserEntity}
        style={[
          styles.wrapper,
          index === 0 && styles.wrapperWithTopMargin,
          isOnboarding ? styles.onboardingWrapper : commonStyles.shadow,
        ]}
        activeOpacity={1}>
        <View style={styles.detailsWrapper}>
          {this.renderUserThumbnail()}
          <View style={styles.entityItemHeaderTexts}>
            {this.renderHeader({shouldRenderActions})}
            <View style={styles.details}>
              {!!currentlyLiveIn &&
                this.renderCurrentlyLiveIn({currentlyLiveIn, locationAction})}
              {!!arrivalDate && this.renderArrivalDate({arrivalDate})}
              {!!numOfMutualFriends &&
                numOfMutualFriends > 0 &&
                this.renderMutualFriends({numOfMutualFriends})}
            </View>
          </View>
        </View>
        {shouldRenderInteractionsBar &&
          !isOnboarding &&
          this.renderInteractionsBar({user: data, originType})}
      </TouchableOpacity>
    );
  }

  renderHeader = ({shouldRenderActions}) => {
    const {invited} = this.state;
    const {
      data: {roles, name, rolePrefix},
      isOnboarding,
    } = this.props;
    const badgeType = getTopUserRole(roles);

    return (
      <View
        style={[
          styles.headerContainer,
          !!badgeType && styles.headerContainerWithBadge,
        ]}>
        <View style={styles.headerDetails}>
          <Text
            size={18}
            lineHeight={20}
            color={flipFlopColors.b30}
            numberOfLines={2}
            style={styles.username}
            bold>
            {name}
          </Text>
          {!!badgeType && (
            <InsiderBadge
              type={badgeType}
              rolePrefix={rolePrefix}
              iconSize={11}
              size={11}
              style={styles.badge}
              originEntity={componentNamesForAnalytics.PEOPLE_TAB}
            />
          )}
        </View>
        {shouldRenderActions && (
          <View
            style={[
              styles.actionButton,
              isOnboarding && styles.obActionButton,
              isOnboarding && invited && styles.oBInvitedActionButton,
            ]}>
            {this.renderActionButton()}
          </View>
        )}
      </View>
    );
  };

  renderArrivalDate = ({arrivalDate}) => (
    <View style={styles.detailsRow}>
      <View style={styles.detailsIcon}>
        <AwesomeIcon
          name="plane"
          weight="solid"
          color={flipFlopColors.b70}
          size={10}
        />
      </View>
      <Text
        size={13}
        lineHeight={17}
        color={flipFlopColors.b30}
        numberOfLines={1}>
        {I18n.t('user_entity_component.arrival_date', {arrivalDate})}
      </Text>
    </View>
  );

  renderCurrentlyLiveIn = ({currentlyLiveIn, locationAction}) => {
    const {isOnboarding} = this.props;
    return (
      <View style={styles.detailsRow}>
        <View style={styles.detailsIcon}>
          <AwesomeIcon
            name="map-marker-alt"
            weight="solid"
            color={flipFlopColors.b70}
            size={10}
          />
        </View>
        <Text
          size={13}
          lineHeight={20}
          color={isOnboarding ? null : flipFlopColors.b30}
          numberOfLines={1}
          onPress={locationAction}>
          {currentlyLiveIn}
        </Text>
      </View>
    );
  };

  renderUserThumbnail = () => {
    const {
      data: {
        name,
        themeColor,
        media: {thumbnail},
      },
    } = this.props;
    return (
      <View style={[commonStyles.shadow, styles.entityAvatarWrapper]}>
        <Avatar
          size="large1"
          name={name}
          themeColor={themeColor}
          entityType="user"
          thumbnail={thumbnail}
          resizeMode="cover"
          linkable={false}
          imageStyle={styles.entityAvatar}
        />
      </View>
    );
  };

  renderMutualFriends = ({numOfMutualFriends}) => (
    <TouchableOpacity
      onPress={this.navigateToMutualFriends}
      style={styles.detailsRow}
      activeOpacity={1}>
      <View style={styles.detailsIcon}>
        <AwesomeIcon
          name="user-friends"
          weight="solid"
          color={flipFlopColors.b70}
          size={10}
        />
      </View>
      <TranslatedText size={13} lineHeight={17} color={flipFlopColors.b30}>
        {I18n.p(numOfMutualFriends, 'user_entity_component.mutual_friends')}
      </TranslatedText>
      <Text size={13} lineHeight={17} color={flipFlopColors.b30}>
        {' '}
        {I18n.t('user_entity_component.friends')}
      </Text>
    </TouchableOpacity>
  );

  renderActionButton = () => {
    const {
      isOnboarding,
      data: {friendshipStatus},
    } = this.props;
    const {invited} = this.state;
    const isFriendshipDeclined =
      friendshipStatus === friendshipStatusType.REJECTED;
    if (isOnboarding) {
      return (
        <IconButton
          isAwesomeIcon
          name={invited ? 'user-clock' : 'user-plus'}
          weight="solid"
          onPress={this.toggleInvitedIcon}
          iconColor={invited ? 'white' : 'green'}
          iconSize={15}
        />
      );
    }
    if (friendshipStatus === friendshipStatusType.FRIENDS) {
      return (
        <IconButton
          isAwesomeIcon
          name="user-check"
          weight="solid"
          onPress={this.navigateToConversation}
          iconColor="b30"
          iconSize={15}
        />
      );
    } else if (
      friendshipStatus === friendshipStatusType.REQUEST_SENT ||
      isFriendshipDeclined
    ) {
      return (
        <IconButton
          name="friends-"
          onPress={isFriendshipDeclined ? null : this.navigateToUser}
          iconColor="b30"
          iconSize={25}
        />
      );
    } else if (invited) {
      return (
        <IconButton
          isAwesomeIcon
          name="user-clock"
          weight="solid"
          onPress={this.toggleInviteWrapper}
          iconColor="b30"
          iconSize={15}
        />
      );
    } else {
      return (
        <IconButton
          name="add-friend"
          onPress={this.toggleInviteWrapper}
          iconColor="b30"
          iconSize={25}
        />
      );
    }
  };

  renderInteractionsBar = ({user, originType}) => (
    <React.Fragment>
      <View style={styles.dashedBorder}>
        <DashedBorder />
      </View>

      <InteractionsBar
        style={styles.interactionBar}
        interactionIconsContainerStyle={styles.interactionIconsContainer}
        iconSize={21}
        isFlatIcons
        user={user}
        originType={originType}
        withSeparators
      />
    </React.Fragment>
  );

  onPressUserEntity = () => {
    const {disableNavigation} = this.props;

    if (!disableNavigation) {
      this.navigateToUser();
    }
  };

  navigateToUser = () => {
    const {
      data: {
        id,
        name,
        media: {thumbnail},
        themeColor,
      },
    } = this.props;
    navigationService.navigateToProfile({
      entityId: id,
      data: {name, thumbnail, themeColor},
    });
  };

  navigateToNeighborhood = () => {
    const {data} = this.props;
    const {neighborhood} = data.journey;

    navigationService.navigate(screenNames.MyNeighborhoodView, {neighborhood});
  };

  navigateToConversation = () => {
    // const {
    //   data,
    //   data: { id: participantId, name: participantName },
    //   ownUser,
    //   originType
    // } = this.props;
    // const participant = { participantId, participantName, participantAvatar: get(data, 'media.thumbnail') };
    // analytics.actionEvents
    //   .clickToMessageAction({
    //     actorId: ownUser.id,
    //     actorName: ownUser.name,
    //     screenCollection: originType,
    //     entityType: entityTypes.USER,
    //     interactionType: interactionTypes.GENERAL,
    //     recipientId: participantId,
    //     recipientName: participantId,
    //     recipientType: entityTypes.USER
    //   })
    //   .dispatch();
    // navigationService.navigate(screenNames.Chat, participant);
  };

  toggleInviteWrapper = () => {
    const {invited} = this.state;
    this.setState({invited: !invited}, () => {
      this.toggleFriendshipRequest({sendInvite: !invited});
    });
  };

  toggleFriendshipRequest = async ({sendInvite}) => {
    // const {
    //   data: { id, name, mutualFriends },
    //   apiCommand,
    //   inviteFriendRequest
    // } = this.props;
    // const { invited } = this.state;
    // if (sendInvite) {
    //   const res = await inviteFriendRequest({ userId: id, userName: name, mutualFriends });
    //   if (isInviteFriendRequestGotError(res)) {
    //     this.setState({ invited: !invited });
    //   }
    // } else {
    //   apiCommand('friendships.unfriend', { toId: id });
    // }
  };

  navigateToMutualFriends = () => {
    const {
      data: {id, name},
    } = this.props;
    navigationService.navigate(screenNames.OthersFriendsList, {
      entityId: id,
      name,
      subTab: OthersFriendsList.subTabs.MUTUAL_FRIENDS,
    });
  };

  toggleInvitedIcon = () => {
    const {data, toggleInvite} = this.props;
    const {invited} = this.state;
    this.setState({invited: !invited}, () => {
      toggleInvite && toggleInvite({user: data});
    });
  };
}

UserEntityComponent.defaultProps = {
  isOnboarding: false,
  showAction: true,
};

UserEntityComponent.propTypes = {
  data: userScheme,
  ownUser: userScheme,
  index: PropTypes.number,
  isOnboarding: PropTypes.bool,
  showAction: PropTypes.bool,
  toggleInvite: PropTypes.func,
  disableNavigation: PropTypes.bool,
  disableLocationNavigation: PropTypes.bool,
  //   apiCommand: PropTypes.func,
  //   inviteFriendRequest: PropTypes.func,
  originType: PropTypes.oneOf(Object.values(originTypes)),
};

const mapStateToProps = (state) => ({
  ownUser: state.auth.user,
});

const mapDispatchToProps = {
  //   apiCommand,
  //   inviteFriendRequest
};

UserEntityComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserEntityComponent);
export default UserEntityComponent;
