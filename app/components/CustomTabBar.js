import * as React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import I18n from '../infra/localization';
import {connect} from 'react-redux';
// import { getConnectedAcounts } from '/redux/auth/actions';
import {get} from '../infra/utils';
import {View, Image, Text} from '../components/basicComponents';
import images from '../assets/images';
import {AwesomeIcon} from '../assets/icons';
import {
  screenNames,
  screenGroupNames,
  screensWithoutFooter,
} from '///vars/enums';
import {flipFlopColors, uiConstants} from '../vars';
import {navigationService} from '../infra/navigation';
import {isHebrewOrArabic} from '../infra/utils/stringUtils';

const FOOTER_BACKGROUND_ABSOLUTE_HEIGHT = 133;
const ACTIVE_TAB_ICON_COLOR = flipFlopColors.green;
const ACTIVE_TAB_TEXT_COLOR = flipFlopColors.green;
const INACTIVE_TAB_ICON_COLOR = flipFlopColors.b30;
const INACTIVE_TAB_TEXT_COLOR = flipFlopColors.b70;
const TAB_HEIGHT = 45;

const {width} = Dimensions.get('screen');
const isSmallWidth = width < 450;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: TAB_HEIGHT,
    marginBottom: Platform.select({
      ios: uiConstants.FOOTER_MARGIN_BOTTOM + 10,
      android: uiConstants.FOOTER_MARGIN_BOTTOM + 10,
    }),
    backgroundColor: flipFlopColors.white,
  },
  innerWrapper: {
    height: TAB_HEIGHT,
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    height: 25,
    marginBottom: 2,
    justifyContent: 'flex-start',
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    zIndex: 1,
  },
  hebrewLabel: {
    top: 1,
  },
  badgeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -7,
    left: Platform.select({android: isSmallWidth ? 38 : 48, ios: 42}),
    minWidth: 17,
    height: 17,
    borderRadius: 12,
    backgroundColor: flipFlopColors.white,
  },
  counterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 14,
    minWidth: 14,
    borderRadius: 14,
    backgroundColor: flipFlopColors.pinkishRed,
  },
  counterText: {
    paddingHorizontal: 4,
    textAlign: 'center',
    color: flipFlopColors.white,
  },
  footerBackgroundWrapper: {
    position: 'absolute',
    top: -20,
    left: 0,
    width: '100%',
    height: FOOTER_BACKGROUND_ABSOLUTE_HEIGHT,
  },
  footerBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

const tabs = {
  [screenGroupNames.HOME_TAB]: {
    labelName: 'home',
    icon: {
      name: 'home',
      size: 22,
    },
  },
  [screenGroupNames.PEOPLE_TAB]: {
    labelName: 'people',
    icon: {
      name: 'user-alt',
      size: 20,
      wrapperStyle: {
        top: 1,
      },
    },
  },
  [screenGroupNames.SOLUTIONS]: {
    labelName: 'solutions',
    image: {
      src: images.tabsFooter.lightbulb_icon,
      activeSrc: images.tabsFooter.lightbulb_icon_active,
      width: 35,
      height: 35,
      wrapperStyle: {
        top: -15,
      },
    },
  },
  [screenGroupNames.GROUPS_TAB]: {
    labelName: 'groups',
    icon: {
      isAwesomeIcon: true,
      name: 'users',
      activeName: 'users',
      size: 22,
    },
    activeColor: flipFlopColors.green,
  },
  [screenGroupNames.NOTIFICATIONS]: {
    labelName: 'activity',
    icon: {
      name: 'bell',
      size: 22,
    },
  },
};

class CustomTabBar extends React.PureComponent {
  render() {
    const {navigation} = this.props;
    const {
      state: {routes},
    } = navigation;
    const {name, params = {}} = navigationService.getCurrentRouteName({
      withParams: true,
    });
    if (screensWithoutFooter[name] || params.hideCustomTabBar) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.footerBackgroundWrapper}>
          <Image
            source={images.tabsFooter.background}
            style={styles.footerBackground}
          />
        </View>
        <View style={styles.innerWrapper}>
          {routes.map(this.renderTabWithIcon)}
        </View>
      </View>
    );
  }

  renderTabWithIcon = (route, routeIndex) => {
    const {
      friendRequestsNumber,
      unseenNotifications,
      unreadChats,
      navigation,
      getTestID,
    } = this.props;
    const {
      state: {index},
    } = navigation;
    const isFocused = routeIndex === index;
    const testID = getTestID({route});
    const tab = tabs[route.routeName];

    if (!tab) {
      return null;
    }

    let counter = 0;
    if (route.routeName === screenGroupNames.PEOPLE_TAB) {
      counter = friendRequestsNumber;
    } else if (route.routeName === screenGroupNames.NOTIFICATIONS) {
      counter = Math.min(unseenNotifications, 99);
    } else if (route.routeName === screenGroupNames.CHAT_LOBBY) {
      counter = Math.min(unreadChats, 99);
    }

    const textColor = isFocused
      ? ACTIVE_TAB_TEXT_COLOR
      : INACTIVE_TAB_TEXT_COLOR;
    const tabStyle = [styles.tab];
    const iconWrapperStyle = [styles.iconWrapper];
    if (tab.icon && tab.icon.wrapperStyle) {
      iconWrapperStyle.push(tab.icon.wrapperStyle);
    }
    if (tab.style) {
      tabStyle.push(tab.style);
    }

    const tabName = I18n.t(`tab_names.${tab.labelName}`);
    return (
      <TouchableWithoutFeedback
        key={route.key}
        onPress={() => this.handleTabPress({route, isFocused})}>
        <View style={tabStyle}>
          <View style={iconWrapperStyle}>
            {this.renderTabIcon({tab, isFocused})}
          </View>
          {!!counter && this.renderBadge({counter})}
          <Text
            style={[
              styles.label,
              isHebrewOrArabic(tabName) && styles.hebrewLabel,
            ]}
            size={11}
            lineHeight={13}
            color={textColor}
            bold={isFocused}
            testID={testID}>
            {tabName}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderTabIcon = ({tab, isFocused}) => {
    const {image, icon} = tab;

    const activeStyle = [];
    if (tab.activeStyle) {
      activeStyle.push(tab.activeStyle);
    }

    if (image) {
      const {width, height, src, activeSrc = src} = image;
      const imageStyles = [styles.icon, {width, height}];

      if (isFocused && activeStyle) {
        imageStyles.push(activeStyle);
      }

      if (image.wrapperStyle) {
        imageStyles.push(image.wrapperStyle);
      }

      return (
        <Image
          source={isFocused ? activeSrc : src}
          resizeMode="contain"
          style={imageStyles}
        />
      );
    }

    const {name, size} = icon;
    const iconColor = isFocused
      ? ACTIVE_TAB_ICON_COLOR
      : INACTIVE_TAB_ICON_COLOR;
    return (
      <AwesomeIcon
        name={name}
        size={size}
        color={iconColor}
        style={[styles.icon, isFocused && activeStyle]}
        weight={'light'}
      />
    );
  };

  renderBadge = ({counter}) => (
    <View style={styles.badgeWrapper}>
      <View style={styles.counterWrapper}>
        <Text size={10} lineHeight={12} bold style={styles.counterText}>
          {counter}
        </Text>
      </View>
    </View>
  );

  handleTabPress = ({route, isFocused}) => {
    const {onTabPress} = this.props;
    if (isFocused) {
      const {routeName} = route.routes[0];
      if (route.routes.length > 1) {
        const {key} = route.routes[1];
        navigationService.goBack(key);
      } else {
        navigationService.resetToScreen(routeName);
      }
    } else {
      onTabPress({route});
    }
  };

  extractTestIDProps = (scene) => {
    const {getTestID} = this.props;
    if (getTestID) {
      const data = getTestID(scene);
      return data ? data.testID : null;
    }
    return null;
  };

  //   navigateToConnectedAccounts = async () => {
  //     const { getConnectedAcounts } = this.props;
  //     const connectedAccounts = await getConnectedAcounts();
  //     if (connectedAccounts.length) {
  //       navigationService.navigate(screenNames.ConnectedUsersList, { connectedAccounts, isSoundEnabled: false });
  //     }
  //   };
}

CustomTabBar.propTypes = {
  navigation: PropTypes.object,
  onTabPress: PropTypes.func,
  getTestID: PropTypes.func,
  friendRequestsNumber: PropTypes.number,
  unseenNotifications: PropTypes.number,
  unreadChats: PropTypes.number,
  // getConnectedAcounts: PropTypes.func,
};

const mapStateToProps = (state) => ({
  friendRequestsNumber: get(state, 'friendships.friendRequestsNumber'),
  unseenNotifications: get(state, 'notifications.unseenNotifications'),
  unreadChats: get(state, 'inbox.unreadChats'),
});

export default connect(
  mapStateToProps,
  // , {getConnectedAcounts}
)(CustomTabBar);
