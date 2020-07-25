/* eslint no-fallthrough: ["error", { "commentPattern": "break is omitted" }] */
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { markAsRead } from '/redux/notifications/actions';
import {
  View,
  Text,
  Avatar,
  TranslatedText,
} from '../../components/basicComponents';
import {
  locationTypes,
  entityTypes,
  postTypes,
  screenNames,
  screenNamesByEntityType,
} from '../../vars/enums';
import {flipFlopColors} from '../../vars';
import {get} from '../../infra/utils';
import {
  getLocaleTimeForFeed,
  getISOStringDateOnly,
} from '../../infra/utils/dateTimeUtils';
import {navigationService} from '../../infra/navigation';
import {pluralTranslateWithZero} from '../../redux/utils/common';
import {
  addSpaceOnCapitalsAndCapitalize,
  noHTMLtags,
} from '../../infra/utils/stringUtils';
import {EntityImagePlaceholder} from '../../components/entity';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
  },
  containerUnread: {
    backgroundColor: flipFlopColors.fillGrey,
  },
  image: {
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  text: {
    flex: 1,
    fontSize: 15,
  },
  imagePlaceholderContainer: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 40,
  },
  imagePlaceholder: {
    backgroundColor: flipFlopColors.transparent,
  },
});

const eventToTextValidationMap = {
  aggregated_comments: [
    'default',
    'post',
    'followed',
    'mentioned',
    'listitem',
    'comment',
  ],
  aggregated_posts: [
    'default',
    'mentioned',
    'tipRequest',
    'groupAnnounce',
    'saved',
    'inactive',
  ],
  aggregated_likes: ['default', 'post', 'comment'],
  aggregated_friendships: ['default', 'request', 'approved'],
  aggregated_groups: [
    'default',
    'request',
    'invited',
    'joinedByOther',
    'joinedBySelf',
    'postInGroup',
    'frndPost',
    'approved',
    'isAdmin',
  ],
  aggregated_events: ['invited', 'upcomingTMR'],
  aggregated_pages: ['default', 'follow', 'invited'],
  aggregated_neighborhoods: ['default', 'joined'],
  aggregated_lists: ['itemAdded', 'saved'],
  aggregated_listitems: ['saved', 'itemVoted'],
  aggregated_broadcasts: ['notif'],
};

const eventTypes = {
  COMMENTS: 'aggregated_comments',
  LIKES: 'aggregated_likes',
  FRIENDSHIPS: 'aggregated_friendships',
  PAGES: 'aggregated_pages',
  POSTS: 'aggregated_posts',
  NEIGHBORHOODS: 'aggregated_neighborhoods',
  LISTS: 'aggregated_lists',
  LIST_ITEMS: 'aggregated_listitems',
  BROADCAST: 'aggregated_broadcasts',
};

const eventActions = {
  FOLLOW: 'follow',
  INVITED: 'invited',
  TIP_REQUEST: 'tipRequest',
  JOINED: 'joined',
};

class NotificationItem extends Component {
  render() {
    if (
      !Object.keys(this.props.data).length ||
      (!get(this.props, 'data.actors', []).length &&
        !get(this.props, 'data.actorless', false))
    ) {
      return null;
    }

    const {
      data: {isRead, eventType, eventAction},
    } = this.props;

    const isValidNotification =
      eventToTextValidationMap[eventType] &&
      eventToTextValidationMap[eventType].includes(eventAction);
    if (!isValidNotification) {
      return null;
    }

    const containerStyle = StyleSheet.flatten([
      styles.container,
      !isRead && styles.containerUnread,
    ]);

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.handleNotificationPressed}>
        {this.renderImage()}
        <View style={styles.details}>
          {this.renderContent()}
          {this.renderTime()}
        </View>
      </TouchableOpacity>
    );
  }

  renderImage() {
    const {
      data: {actors, payload, eventType, eventAction},
      userNeighbourhood,
    } = this.props;

    const {entityType, entitySubType} = payload;
    const isInactiveEventAction = eventAction === `inactive`;

    if (isInactiveEventAction) {
      return (
        <View style={[styles.image, styles.imagePlaceholderContainer]}>
          <EntityImagePlaceholder
            containerStyle={styles.imagePlaceholder}
            entityType={entityType}
            postType={entitySubType}
          />
        </View>
      );
    }

    const {id: entityId, themeColor, name} = actors.length ? actors[0] : {};
    let {media} = actors.length ? actors[0] : payload;
    if (eventType === eventTypes.NEIGHBORHOODS && userNeighbourhood) {
      ({media} = userNeighbourhood);
    }

    return (
      <Avatar
        size="medium2"
        style={styles.image}
        entityId={entityId}
        entityType={entityTypes.USER}
        themeColor={themeColor}
        name={name}
        thumbnail={media ? media.thumbnail : null}
        linkable={false}
      />
    );
  }

  renderContent() {
    const {
      data: {actors, payload, actorless, eventAction},
    } = this.props;
    const {name} = actorless ? {} : actors[0];
    const {activitiesCount, title} = payload;
    let {actorsCount} = payload;
    const isInactiveEventAction = eventAction === `inactive`;
    actorsCount = actorsCount > 0 ? actorsCount - 1 : actorsCount;
    return (
      <Text forceLTR style={styles.text}>
        {!actorless && (
          <TranslatedText style={styles.text}>
            {pluralTranslateWithZero(
              actorsCount,
              'communication_center.notifications.actors',
              {name, count: actorsCount},
            )}
          </TranslatedText>
        )}
        {actorless && isInactiveEventAction && (
          <TranslatedText style={styles.text}>
            {I18n.p(
              activitiesCount,
              'communication_center.notifications.activities',
              {title, count: activitiesCount},
            )}
          </TranslatedText>
        )}
        {this.renderText()}
      </Text>
    );
  }

  getBroadcastText(title, description) {
    let plainDescription = noHTMLtags(description);
    if (plainDescription.length > 70) {
      plainDescription = `${plainDescription.substring(0, 70)} ...`;
    }
    return `<b>${title || ''}</b>\n${plainDescription}`;
  }

  renderText() {
    const {
      data: {payload, eventType, eventAction},
      community,
    } = this.props;

    const {title, description} = payload;
    let {entityName, prefix} = payload;
    const {activitiesCount, entityType, entitySubType} = payload;
    entityName = entityName && entityName.toString().replace('\n', '');
    prefix = prefix && prefix.toString().replace('\n', '');

    const resolvedEventType =
      eventType === eventTypes.NEIGHBORHOODS
        ? `${eventType}.${community.destinationPartitionLevel}`
        : eventType;
    const resolvedEventAction =
      eventType === eventTypes.LIKES && entitySubType === postTypes.INTRODUCTION
        ? 'welcomed'
        : eventAction;
    const isInactiveEventAction = eventAction === `inactive`;
    const isBroadcastEventType = eventType === eventTypes.BROADCAST;
    let notificationText;

    if (isBroadcastEventType) {
      notificationText = this.getBroadcastText(title, description);
    } else if (isInactiveEventAction) {
      notificationText = I18n.p(
        activitiesCount,
        `communication_center.notifications.${resolvedEventType}.${resolvedEventAction}`,
        {
          postType: addSpaceOnCapitalsAndCapitalize(
            entitySubType,
          ).toLowerCase(),
        },
      );
    } else {
      notificationText = I18n.t(
        `communication_center.notifications.${resolvedEventType}.${resolvedEventAction}`,
        {
          count: activitiesCount,
          entityName,
          entityType,
          prefix,
          activitiesCount,
        },
      );
    }

    return (
      <TranslatedText style={styles.text}>{notificationText}</TranslatedText>
    );
  }

  renderTime() {
    const {
      data: {eventTime},
    } = this.props;
    return (
      <Text medium size={11} color={flipFlopColors.placeholderGrey}>
        {getLocaleTimeForFeed(eventTime)}
      </Text>
    );
  }

  handleNotificationPressed = () => {
    // const {
    //   markAsRead,
    //   data: { actors, id, eventType, eventAction }
    // } = this.props;
    // markAsRead(id);
    // switch (eventType) {
    //   case eventTypes.FRIENDSHIPS:
    //     this.navigateToProfile();
    //     break;
    //   case eventTypes.POSTS:
    //     if (eventAction === eventActions.TIP_REQUEST && actors.length > 1) {
    //       this.navigateToPostListPage();
    //     } else {
    //       this.navigateToItemPage();
    //     }
    //     break;
    //   case eventTypes.NEIGHBORHOODS:
    //     if (eventAction === eventActions.JOINED) {
    //       this.navigateToNeighborhoodPage();
    //       break;
    //     }
    //     break;
    //   case eventTypes.PAGES:
    //     if (eventAction === eventActions.FOLLOW) {
    //       this.navigateToFollowers();
    //       break;
    //     }
    //   // caution: break is omitted intentionally falls through
    //   default:
    //     this.navigateToItemPage();
    // }
  };

  navigateToItemPage() {
    const {
      data: {payload},
    } = this.props;

    let {entityType = '', entityId} = payload;
    const {group: {groupType} = {}, parentId} = payload;
    if (entityType === entityTypes.COMMENT) {
      const {entityParent = {}} = payload;
      if (
        entityParent.entityType === entityTypes.COMMENT &&
        entityParent.parent
      ) {
        ({entityType, entityId} = entityParent.parent);
      } else {
        ({entityType, entityId} = entityParent);
      }
    }

    if (entityType === entityTypes.LIST_ITEM) {
      navigationService.navigate(screenNames.ListView, {
        entityId: parentId,
        initialFocusedItem: entityId,
      });
      return;
    }

    navigationService.navigate(screenNamesByEntityType[entityType], {
      entityId,
      groupType,
    });
  }

  navigateToPostListPage() {
    const {
      data: {actors, eventTime},
    } = this.props;
    const actorIds = actors.map((x) => x.id);
    const date = getISOStringDateOnly(eventTime);
    navigationService.navigate(screenNames.CityResults, {
      postType: eventActions.TIP_REQUEST,
      date,
      actors: actorIds,
    });
  }

  navigateToProfile() {
    const {
      data: {actors},
    } = this.props;

    navigationService.navigateToProfile({
      entityId: actors[0].id,
      data: {
        name: actors[0].name,
        thumbnail: actors[0].media.thumbnail,
        themeColor: actors[0].themeColor,
      },
    });
  }

  navigateToFollowers() {
    const {
      data: {
        payload: {entityName, entityId},
      },
    } = this.props;

    navigationService.navigate(screenNames.SaversAndFollowers, {
      pageId: entityId,
      pageName: entityName,
      initialTabValue: 'followers',
    });
  }

  navigateToNeighborhoodPage() {
    const {
      data: {
        payload: {entityName, neighborhood},
      },
    } = this.props;

    navigationService.navigate(screenNames.EntitiesInLocation, {
      name: entityName,
      type: locationTypes.LIVE_IN,
      coordinates: neighborhood.coordinates,
    });
  }
}

NotificationItem.propTypes = {
  data: PropTypes.shape({
    payload: PropTypes.object,
    actors: PropTypes.array,
    eventType: PropTypes.string,
    eventAction: PropTypes.string,
    eventTime: PropTypes.string,
    id: PropTypes.string,
    actorsCount: PropTypes.number,
    isRead: PropTypes.bool,
    actorless: PropTypes.bool,
  }),
  //   markAsRead: PropTypes.func,
  userNeighbourhood: PropTypes.object,
  community: PropTypes.shape({
    destinationPartitionLevel: PropTypes.string,
  }),
};

const mapDispatchToProps = {};
const mapStateToProps = (state) => ({
  community: state.auth.user.community,
  userNeighbourhood: get(state, 'auth.user.journey.neighborhood', undefined),
});
NotificationItem = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationItem);
export default NotificationItem;
