import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {View} from '/components/basicComponents';
import {NotificationsLoadingState} from '../../components/loaders';

import {flipFlopColors} from '../../vars';
import {originTypes} from '../../vars/enums';
import {InfiniteScroll} from '../../components';
import NotificationItem from './NotificationItem';
import EmptyList from './EmptyList';
import EnableNotificationDialog from './EnableNotificationDialog';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerNoNotifications: {
    backgroundColor: flipFlopColors.white,
  },
  enableNotifications: {
    width: '100%',
    paddingTop: 20,
  },
});

class Notifications extends Component {
  render() {
    const {notifications} = this.props;

    return (
      <View
        style={[
          styles.container,
          notifications &&
            !notifications.length &&
            styles.containerNoNotifications,
        ]}>
        <InfiniteScroll
          // apiQuery={{domain: 'notifications', key: 'notifications'}}
          ListItemComponent={NotificationItem}
          // reducerStatePath="notifications"
          // onUpdate={this.handleInfiniteScrollUpdated}
          // ListHeaderComponent={<EnableNotificationDialog style={styles.enableNotifications} originType={originTypes.NOTIFICATIONS_CENTER} />}
          ListEmptyComponent={<EmptyList />}
          ListLoadingComponent={<NotificationsLoadingState />}
        />
      </View>
    );
  }
}

export default Notifications;
