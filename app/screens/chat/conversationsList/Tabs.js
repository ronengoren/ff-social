import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { openActionSheet } from '/redux/general/actions';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, IconButton} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import {chatTabTypes} from '../../../vars/enums';
import {isAppAdmin} from '../../../infra/utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  tabs: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: flipFlopColors.paleGreyFour,
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  middleTab: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: flipFlopColors.paleGreyFour,
  },
  unreadBtn: {
    marginRight: 10,
    marginBottom: 3,
  },
});
function Tab({name, value, isMiddle, activeTab, onPress, unreadCount}) {
  const isActive = activeTab === value;
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive && styles.activeTab,
        isMiddle && styles.middleTab,
      ]}
      onPress={() => onPress(value)}
      activeOpacity={1}>
      <Text color={isActive ? flipFlopColors.green : flipFlopColors.b60}>
        {unreadCount ? `${unreadCount} ` : ''}
        {name}
      </Text>
    </TouchableOpacity>
  );
}

Tab.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  isMiddle: PropTypes.bool,
  activeTab: PropTypes.string,
  onPress: PropTypes.func,
  unreadCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

function Tabs({
  activeTab,
  onPress,
  isUnreadSort,
  onSortChange,
  unreadTabsChats,
  isAdmin,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.tabs} testID="conversationTabs">
        <Tab
          name="Inbox"
          value={chatTabTypes.INBOX}
          activeTab={activeTab}
          onPress={onPress}
          // unreadCount={unreadTabsChats[chatTabTypes.INBOX] || null}
        />
        <Tab
          name="Requests"
          value={chatTabTypes.REQUESTS}
          isMiddle
          activeTab={activeTab}
          onPress={onPress}
          // unreadCount={unreadTabsChats[chatTabTypes.REQUESTS] || null}
        />
        <Tab
          name="Blocked"
          value={chatTabTypes.BLOCKED}
          activeTab={activeTab}
          onPress={onPress}
          // unreadCount={unreadTabsChats[chatTabTypes.BLOCKED] || null}
        />
      </View>
      {isAdmin && (
        <IconButton
          name="pizza-slice"
          isAwesomeIcon
          iconColor={isUnreadSort ? 'green' : 'b60'}
          iconSize={28}
          onPress={onSortChange}
          style={styles.unreadBtn}
        />
      )}
    </View>
  );
}

Tabs.propTypes = {
  activeTab: PropTypes.string,
  onPress: PropTypes.func,
  isUnreadSort: PropTypes.bool,
  onSortChange: PropTypes.func,
  // unreadTabsChats: PropTypes.object,
  // isAdmin: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  // unreadTabsChats: state.inbox.unreadTabsChats,
  // isAdmin: isAppAdmin(state.auth.user),
});

export default connect(mapStateToProps, {})(Tabs);
